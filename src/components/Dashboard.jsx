import React, { useState, useMemo } from 'react';
import { Activity, Plus, Heart, Droplet, Info, Thermometer, Zap, TrendingUp, Syringe, Calendar } from 'lucide-react';
import { Modal, Input, Button, VerticalMeter, Slider } from './ui/BaseComponents';
import AlertBox from './ui/AlertBox';
import BodySelector from './ui/BodySelector';
import { suggestNextInjection, getSiteById } from '../services/InjectionService';
import { MOCK_MEDICATIONS } from '../constants/medications';

const TIPS = [
    "Beba pelo menos 2.5L de Ã¡gua para ajudar os rins a processar a quebra de gordura.",
    "Priorize proteÃ­nas em todas as refeiÃ§Ãµes para evitar a perda de massa muscular.",
    "Se sentir nÃ¡usea, experimente comer porÃ§Ãµes menores e evitar frituras.",
    "A constipaÃ§Ã£o Ã© comum; aumente a ingestÃ£o de fibras e considere um suplemento.",
    "Mantenha um sono regular; o descanso Ã© fundamental para o equilÃ­brio hormonal."
];

const Dashboard = ({ user, setUser }) => {
    const medication = MOCK_MEDICATIONS.find(m => m.id === user.medicationId);
    const [showWeightModal, setShowWeightModal] = useState(false);
    const [newWeight, setNewWeight] = useState('');
    const [showInjectionModal, setShowInjectionModal] = useState(false);
    const [selectedSiteId, setSelectedSiteId] = useState(null);
    const [showSpeedInfo, setShowSpeedInfo] = useState(false);
    const [showPlateauInfo, setShowPlateauInfo] = useState(false);

    // Get date key for daily tracking
    const today = new Date().toISOString().split('T')[0];
    const dailyData = user.dailyIntakeHistory[today] || { water: 0, protein: 0 };

    const updateIntake = (type, amount) => {
        const currentAmount = dailyData[type];
        const newAmount = Math.max(0, currentAmount + amount);

        const updatedUser = {
            ...user,
            dailyIntakeHistory: {
                ...user.dailyIntakeHistory,
                [today]: {
                    ...dailyData,
                    [today]: undefined, // cleanup if any artifact
                    [type]: parseFloat(newAmount.toFixed(1))
                }
            }
        };
        setUser(updatedUser);
        localStorage.setItem('mounjoy_user2', JSON.stringify(updatedUser));
    };

    const updateWeight = () => {
        if (!newWeight) return;
        const weightValue = parseFloat(newWeight);
        const updatedUser = {
            ...user,
            currentWeight: weightValue,
            history: [...user.history, weightValue],
            lastWeightDate: new Date().toISOString()
        };
        setUser(updatedUser);
        localStorage.setItem('mounjoy_user2', JSON.stringify(updatedUser));
        setShowWeightModal(false);
        setNewWeight('');
    };

    const formatDate = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const totalLoss = (user.history[0] - user.currentWeight).toFixed(1);

    // INTELLIGENCE ENGINE
    const stats = useMemo(() => {
        const startWeight = user.history[0];
        const currentWeight = user.currentWeight;
        const totalKgLost = startWeight - currentWeight;

        // Loss Rate Calculation
        const startDate = new Date(user.startDate);
        const todayDate = new Date();
        const diffWeeks = Math.max(1, (todayDate - startDate) / (1000 * 60 * 60 * 24 * 7));
        const weeklyRate = (totalKgLost / diffWeeks).toFixed(2);

        // Plateau Detection (Current logic: check if last 3 entries are identical)
        const entries = user.history;
        const isPlateau = entries.length >= 3 &&
            entries[entries.length - 1] === entries[entries.length - 2] &&
            entries[entries.length - 1] === entries[entries.length - 3];

        // Low Hunger Detection
        const isLowHunger = dailyData.protein < (user.settings?.proteinGoal * 0.4);

        return { weeklyRate, isPlateau, isLowHunger };
    }, [user, dailyData]);

    const cycleInfo = useMemo(() => {
        const lastDose = user.doseHistory?.[0];
        if (!lastDose) return { message: "Nenhuma dose registrada ainda.", level: 0, color: "text-slate-400" };

        const lastDoseDate = new Date(lastDose.date);
        const todayDate = new Date();
        const daysSinceDose = Math.floor((todayDate - lastDoseDate) / (1000 * 60 * 60 * 24));

        const drugLevel = Math.exp(-0.138 * daysSinceDose) * 100;

        let message = "";
        let color = "text-brand";
        if (daysSinceDose <= 2) {
            message = "Fase de Pico: Priorize refeiÃ§Ãµes leves.";
            color = "text-brand";
        } else if (daysSinceDose >= 6) {
            message = "NÃ­vel Baixo: O Food Noise pode aumentar. Mantenha o foco!";
            color = "text-orange-500";
        } else {
            message = "NÃ­vel EstÃ¡vel: Aproveite para focar em treinos de forÃ§a.";
            color = "text-teal-600";
        }

        return { message, level: drugLevel, color, daysSinceDose };
    }, [user.doseHistory]);

    const injectionSuggestion = useMemo(() => {
        return suggestNextInjection(user.doseHistory || []);
    }, [user.doseHistory]);

    const handleConfirmInjection = () => {
        const isOral = medication?.route === 'oral';
        const siteId = isOral ? null : (selectedSiteId || injectionSuggestion.id);
        const site = isOral ? null : getSiteById(siteId);

        const newRecord = {
            date: new Date().toISOString(),
            dose: user.currentDose,
            medication: user.medicationId,
            siteId: siteId,
            area: site?.area || 'Oral',
            side: site?.side || 'N/A'
        };

        const updatedUser = {
            ...user,
            doseHistory: [newRecord, ...(user.doseHistory || [])]
        };

        setUser(updatedUser);
        localStorage.setItem('mounjoy_user2', JSON.stringify(updatedUser));
        setShowInjectionModal(false);
        setSelectedSiteId(null);
    };

    const healthInsights = useMemo(() => {
        const startWeight = user.history[0];
        const currentWeight = user.currentWeight;
        const totalLost = startWeight - currentWeight;

        const start = new Date(user.startDate);
        const now = new Date();
        const diffTime = Math.abs(now - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        const weeks = diffDays / 7;

        const speed = weeks > 0 ? totalLost / weeks : 0;

        const insights = [];

        if (speed > 1.5) {
            insights.push({
                type: 'danger',
                title: 'Perda Acelerada',
                message: `VocÃª estÃ¡ perdendo em mÃ©dia ${speed.toFixed(1)}kg por semana. Cuidado com a perda de massa muscular. Aumente o aporte de proteÃ­nas.`,
                onInfo: () => setShowSpeedInfo(true)
            });
        }

        const lastWeights = user.history.slice(-3);
        if (lastWeights.length >= 3 && lastWeights.every(v => v === lastWeights[0])) {
            insights.push({
                type: 'warning',
                title: 'PlatÃ´ Identificado',
                message: 'Seu peso estabilizou nos Ãºltimos 3 registros. Tente variar os treinos.',
                onInfo: () => setShowPlateauInfo(true)
            });
        }

        return insights;
    }, [user.currentWeight, user.history, user.startDate]);

    const dailyTip = useMemo(() => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const day = Math.floor(diff / oneDay);
        return TIPS[day % TIPS.length];
    }, []);

    return (
        <div className="space-y-6 pb-6">
            {/* Health Insights Section */}
            {(healthInsights.length > 0 || dailyTip) && (
                <div className="space-y-3 stagger-1 fade-in">
                    <h3 className="text-lg font-bold text-slate-800 ml-1 font-outfit">Insights de SaÃºde</h3>
                    {healthInsights.map((insight, index) => (
                        <div key={index} className="relative group">
                            <AlertBox
                                type={insight.type}
                                title={insight.title}
                                message={insight.message}
                            />
                            <button
                                onClick={insight.onInfo}
                                className="absolute top-4 right-4 text-slate-400 hover:text-brand transition-colors"
                            >
                                <Info size={16} />
                            </button>
                        </div>
                    ))}
                    <AlertBox
                        type="info"
                        title="Dica do Dia"
                        message={dailyTip}
                    />
                </div>
            )}

            {/* Weight Hero Card + Progress Rings */}
            <div className="stagger-2 fade-in relative overflow-hidden rounded-[40px] p-6 text-white shadow-xl bg-gradient-to-br from-brand-500 to-brand-600">
                <div className="absolute -right-10 -top-10 opacity-10">
                    <Activity size={150} />
                </div>

                <div className="flex justify-between items-start relative z-10 mb-6">
                    <div>
                        <span className="text-teal-50 text-sm font-medium tracking-wide uppercase opacity-80 font-outfit">Seu Progresso</span>
                        <div className="flex items-end gap-2 mt-1">
                            <span className="text-5xl font-bold tracking-tighter">{user.currentWeight}</span>
                            <span className="text-xl font-medium mb-2 opacity-80">kg</span>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setNewWeight(user.currentWeight.toString());
                            setShowWeightModal(true);
                        }}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-3 rounded-2xl transition-all active:scale-90"
                    >
                        <Plus size={24} />
                    </button>
                </div>

                {/* Progress Rings Integrated */}
                <div className="grid grid-cols-2 gap-4 bg-white/10 backdrop-blur-md rounded-[32px] p-4 relative z-10 border border-white/10">
                    <VerticalMeter
                        value={dailyData.protein}
                        max={user.settings?.proteinGoal || 100}
                        color="orange"
                        label="PROTEÍNA"
                    />
                    <VerticalMeter
                        value={dailyData.water}
                        max={user.settings?.waterGoal || 2.5}
                        color="blue"
                        label="HIDRATAÇÃO"
                        lines={['HIDRA', 'TA', 'ÇÃO']}
                    />
                </div>
            </div>

            {/* Injection Tracker Card (Only for Injectables) */}
            {medication?.route === 'injectable' && (
                <div className="stagger-3 fade-in bg-white p-5 rounded-[32px] shadow-sm border border-slate-100 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-outfit">PrÃ³xima AplicaÃ§Ã£o</span>
                            <div className="flex items-center gap-2 mt-1">
                                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                                    {cycleInfo.daysSinceDose >= 7 ? "Dia de Injetar!" : `Em ${7 - cycleInfo.daysSinceDose} dias`}
                                </h3>
                                <span className="text-[10px] bg-slate-100 text-slate-600 font-black px-2 py-0.5 rounded-full uppercase">
                                    Semana {Math.ceil((Math.abs(new Date() - new Date(user.startDate)) / (1000 * 60 * 60 * 24)) / 7) || 1}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowInjectionModal(true)}
                            className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand border border-brand-100 hover:bg-brand-100 transition-all active:scale-95"
                        >
                            <Syringe size={24} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Local Sugerido</span>
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{injectionSuggestion.icon}</span>
                                <span className="text-sm font-black text-slate-800">{injectionSuggestion.label}</span>
                            </div>
                        </div>
                        <div className="bg-brand-50/50 rounded-2xl p-4 border border-brand-100/50 flex flex-col gap-1">
                            <span className="text-[9px] font-black text-brand-600 uppercase tracking-widest">Status do Ciclo</span>
                            <p className={`text-[11px] font-bold ${cycleInfo.color} leading-none`}>{cycleInfo.message}</p>
                        </div>
                    </div>

                    {cycleInfo.daysSinceDose >= 7 && (
                        <Button
                            onClick={() => setShowInjectionModal(true)}
                            className="w-full py-4 rounded-2xl text-sm font-black shadow-lg shadow-brand-500/20 active:scale-[0.98]"
                        >
                            Registrar AplicaÃ§Ã£o de Hoje
                        </Button>
                    )}
                </div>
            )}

            {/* Intelligence Alerts */}
            <div className="space-y-3">
                {stats.isPlateau && (
                    <div className="stagger-1 fade-in bg-amber-50 border border-amber-100 p-4 rounded-[28px] flex items-center gap-3 animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                            <TrendingUp size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Alerta de PlatÃ´</p>
                            <p className="text-xs text-amber-600 font-medium leading-tight">Peso estÃ¡vel hÃ¡ 14 dias. Tente variar a rotina de exercÃ­cios ou hidrataÃ§Ã£o.</p>
                        </div>
                    </div>
                )}

                {stats.isLowHunger && (
                    <div className="stagger-1 fade-in bg-teal-50 border border-teal-100 p-4 rounded-[28px] flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                            <Zap size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-teal-700 uppercase tracking-widest">Baixa Fome Detectada</p>
                            <p className="text-xs text-teal-600 font-medium leading-tight">Priorize refeiÃ§Ãµes leves e densas em proteÃ­na: ovos, iogurte ou shake.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Daily Wellness Checklist (Interactive - CONNECTED) */}
            <div className="stagger-4 fade-in">
                <div className="flex justify-between items-end mb-3 ml-1">
                    <h3 className="text-lg font-bold text-slate-800 font-outfit">Meta do Dia</h3>
                    <div className="text-[10px] font-black text-brand-600 uppercase tracking-widest bg-brand-50 px-2 py-1 rounded-lg">
                        Taxa: {stats.weeklyRate} kg/sem
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {/* Ãgua Card */}
                    <div className="bg-slate-900 p-4 rounded-[32px] shadow-lg flex flex-row items-stretch gap-3 group transition-all active:scale-95 border border-slate-800 overflow-hidden">
                        <div className="flex items-center justify-center shrink-0">
                            <span className="font-black text-white/20 uppercase text-[11px]" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.3em' }}>
                                HIDRATAÃ‡ÃƒO
                            </span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 py-1">
                            <div className="flex-1 w-3 bg-white/10 rounded-full overflow-hidden relative">
                                <div className="absolute bottom-0 left-0 w-full bg-blue-400 rounded-full transition-all duration-1000 ease-out" style={{ height: `${Math.min(100, (dailyData.water / (user.settings?.waterGoal || 2.5)) * 100)}%` }} />
                            </div>
                            <span className="text-[9px] font-black text-blue-400 tabular-nums">{Math.round(Math.min(100, (dailyData.water / (user.settings?.waterGoal || 2.5)) * 100))}%</span>
                        </div>
                        <div className="flex flex-col justify-between items-end flex-1">
                            <div className="text-right">
                                <p className="text-2xl font-black text-white tabular-nums leading-none">{dailyData.water}</p>
                                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">litros</p>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <button onClick={() => updateIntake('water', 0.2)} className="w-8 h-8 rounded-xl bg-blue-500 shadow-lg flex items-center justify-center text-white font-bold text-lg leading-none">+</button>
                                <button onClick={() => updateIntake('water', -0.2)} className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 font-bold text-lg leading-none">âˆ’</button>
                            </div>
                        </div>
                    </div>

                    {/* ProteÃ­na Card */}
                    <div className="bg-slate-900 p-4 rounded-[32px] shadow-lg flex flex-row items-stretch gap-3 group transition-all active:scale-95 border border-slate-800 overflow-hidden">
                        <div className="flex items-center justify-center shrink-0">
                            <span className="font-black text-white/20 uppercase text-[11px]" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.3em' }}>
                                PROTEÃNA
                            </span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 py-1">
                            <div className="flex-1 w-3 bg-white/10 rounded-full overflow-hidden relative">
                                <div className="absolute bottom-0 left-0 w-full bg-orange-400 rounded-full transition-all duration-1000 ease-out" style={{ height: `${Math.min(100, (dailyData.protein / (user.settings?.proteinGoal || 100)) * 100)}%` }} />
                            </div>
                            <span className="text-[9px] font-black text-orange-400 tabular-nums">{Math.round(Math.min(100, (dailyData.protein / (user.settings?.proteinGoal || 100)) * 100))}%</span>
                        </div>
                        <div className="flex flex-col justify-between items-end flex-1">
                            <div className="text-right">
                                <p className="text-2xl font-black text-white tabular-nums leading-none">{dailyData.protein}</p>
                                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">gramas</p>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <button onClick={() => updateIntake('protein', 5)} className="w-8 h-8 rounded-xl bg-orange-500 shadow-lg flex items-center justify-center text-white font-bold text-lg leading-none">+</button>
                                <button onClick={() => updateIntake('protein', -5)} className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 font-bold text-lg leading-none">âˆ’</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Weight Update Modal */}
            <Modal isOpen={showWeightModal} onClose={() => setShowWeightModal(false)} title="Atualizar Peso">
                <div className="text-center mb-8 bg-brand-50/50 rounded-[32px] py-6 border border-brand-100/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-100/30 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                    <p className="text-[10px] font-bold text-brand-600/60 uppercase tracking-[0.2em] mb-1 relative z-10">Registro Anterior</p>
                    <p className="text-4xl font-black text-brand-900 tracking-tighter relative z-10">
                        {user.currentWeight}<span className="text-lg font-medium text-brand-600/40 ml-1">kg</span>
                    </p>
                    <div className="mt-3 relative z-10">
                        <span className="text-[9px] font-black text-white uppercase tracking-widest bg-brand-600 px-3 py-1 rounded-full shadow-sm">
                            {formatDate(user.lastWeightDate || user.startDate)}
                        </span>
                    </div>
                </div>

                <Slider
                    label="Novo Registro"
                    value={newWeight}
                    onChange={setNewWeight}
                    min={50}
                    max={250}
                    step={0.1}
                    suffix="kg"
                />

                <div className="flex flex-col gap-3">
                    <Button
                        onClick={updateWeight}
                        className="w-full py-5 rounded-[24px] text-lg font-black bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-0.5 transition-all active:translate-y-0"
                    >
                        Confirmar Peso
                    </Button>
                    <button
                        onClick={() => setShowWeightModal(false)}
                        className="w-full py-3 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </Modal>

            {/* Modal: Registro de Dose (InjectÃ¡vel ou Oral) */}
            <Modal
                isOpen={showInjectionModal}
                onClose={() => setShowInjectionModal(false)}
                title={medication?.route === 'oral' ? "Registrar Dose" : "Confirmar AplicaÃ§Ã£o"}
            >
                <div className="space-y-4">
                    <div className="bg-slate-900 rounded-[28px] p-5 text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Dose a ser registrada</p>
                            <p className="text-2xl font-black flex items-center gap-2">
                                {medication?.route === 'oral' ? 'ðŸ’Š' : 'ðŸ’‰'} {user.currentDose}
                                <span className="text-sm font-medium text-white/40">({medication?.name})</span>
                            </p>
                        </div>
                    </div>

                    {medication?.route !== 'oral' && (
                        <>
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-4">Escolha o Local da AplicaÃ§Ã£o</label>
                                <BodySelector
                                    selectedSiteId={selectedSiteId || injectionSuggestion.id}
                                    onSelect={setSelectedSiteId}
                                    suggestedSiteId={injectionSuggestion.id}
                                    lastSiteId={user.doseHistory?.[0]?.siteId}
                                />
                            </div>

                            {user.doseHistory?.[0]?.siteId === (selectedSiteId || injectionSuggestion.id) && (
                                <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-3 animate-headShake">
                                    <AlertBox type="warning" title="AtenÃ§Ã£o" message="VocÃª usou este local na Ãºltima aplicaÃ§Ã£o. Recomenda-se a rotaÃ§Ã£o." />
                                </div>
                            )}
                        </>
                    )}

                    <Button onClick={handleConfirmInjection} className="w-full py-5 rounded-[24px] text-lg font-black shadow-2xl">
                        {medication?.route === 'oral' ? "Confirmar Dose âœ¨" : "Registrar AplicaÃ§Ã£o âœ¨"}
                    </Button>
                </div>
            </Modal>

            {/* Modal: Perda Acelerada */}
            <Modal
                isOpen={showSpeedInfo}
                onClose={() => setShowSpeedInfo(false)}
                title="Perda Acelerada"
            >
                <div className="space-y-4 text-slate-600">
                    <p className="text-sm leading-relaxed">
                        Perder mais de 1.5kg por semana de forma consistente pode indicar que vocÃª estÃ¡ perdendo **massa muscular** em vez de apenas gordura.
                    </p>
                    <div className="bg-brand-50 p-4 rounded-2xl border border-brand-100">
                        <h4 className="font-bold text-brand-700 text-xs uppercase mb-2">Como prevenir</h4>
                        <ul className="text-xs space-y-2 list-disc ml-4">
                            <li>Aumente a ingestÃ£o de proteÃ­nas (mÃ­nimo 1.2g/kg).</li>
                            <li>Inicie ou mantenha exercÃ­cios de resistÃªncia.</li>
                            <li>Garanta uma hidrataÃ§Ã£o rigorosa (2.5L+).</li>
                        </ul>
                    </div>
                </div>
            </Modal>

            {/* Modal: PlatÃ´ */}
            <Modal
                isOpen={showPlateauInfo}
                onClose={() => setShowPlateauInfo(false)}
                title="O que Ã© o PlatÃ´?"
            >
                <div className="space-y-4 text-slate-600">
                    <p className="text-sm leading-relaxed">
                        O platÃ´ ocorre quando o corpo se adapta Ã  nova ingestÃ£o calÃ³rica e estabiliza o peso. Ã‰ uma parte natural de qualquer jornada de emagrecimento.
                    </p>
                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                        <h4 className="font-bold text-orange-700 text-xs uppercase mb-2">Dicas para quebrar</h4>
                        <ul className="text-xs space-y-2 list-disc ml-4">
                            <li>Varie os tipos de exercÃ­cios fÃ­sicos.</li>
                            <li>Revise seu diÃ¡rio alimentar.</li>
                            <li>Tire novas medidas.</li>
                        </ul>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
