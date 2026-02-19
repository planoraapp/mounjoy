import React, { useState, useMemo } from 'react';
import { Activity, Plus, Heart, Droplet, Info, Thermometer, Zap, TrendingUp, Syringe, Calendar } from 'lucide-react';
import { Modal, Input, Button, CircularProgress } from './ui/BaseComponents';
import AlertBox from './ui/AlertBox';
import BodySelector from './ui/BodySelector';
import { suggestNextInjection, getSiteById } from '../services/InjectionService';

const TIPS = [
    "Beba pelo menos 2.5L de água para ajudar os rins a processar a quebra de gordura.",
    "Priorize proteínas em todas as refeições para evitar a perda de massa muscular.",
    "Se sentir náusea, experimente comer porções menores e evitar frituras.",
    "A constipação é comum; aumente a ingestão de fibras e considere um suplemento.",
    "Mantenha um sono regular; o descanso é fundamental para o equilíbrio hormonal."
];

const Dashboard = ({ user, setUser }) => {
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
            message = "Fase de Pico: Priorize refeições leves.";
            color = "text-brand";
        } else if (daysSinceDose >= 6) {
            message = "Nível Baixo: O Food Noise pode aumentar. Mantenha o foco!";
            color = "text-orange-500";
        } else {
            message = "Nível Estável: Aproveite para focar em treinos de força.";
            color = "text-teal-600";
        }

        return { message, level: drugLevel, color, daysSinceDose };
    }, [user.doseHistory]);

    const injectionSuggestion = useMemo(() => {
        return suggestNextInjection(user.doseHistory || []);
    }, [user.doseHistory]);

    const handleConfirmInjection = () => {
        const siteId = selectedSiteId || injectionSuggestion.id;
        const site = getSiteById(siteId);

        const newRecord = {
            date: new Date().toISOString(),
            dose: user.currentDose,
            medication: user.medicationId,
            siteId: siteId,
            area: site.area,
            side: site.side
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
                message: `Você está perdendo em média ${speed.toFixed(1)}kg por semana. Cuidado com a perda de massa muscular. Aumente o aporte de proteínas.`,
                onInfo: () => setShowSpeedInfo(true)
            });
        }

        const lastWeights = user.history.slice(-3);
        if (lastWeights.length >= 3 && lastWeights.every(v => v === lastWeights[0])) {
            insights.push({
                type: 'warning',
                title: 'Platô Identificado',
                message: 'Seu peso estabilizou nos últimos 3 registros. Tente variar os treinos.',
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
                    <h3 className="text-lg font-bold text-slate-800 ml-1 font-outfit">Insights de Saúde</h3>
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
                    <CircularProgress
                        value={user.currentWeight * 1.2} // Simplified mock
                        max={100}
                        color="white"
                        label="Proteína"
                        icon="🥩"
                    />
                    <CircularProgress
                        value={1.8} // Simplified mock
                        max={2.5}
                        color="white"
                        label="Hidratação"
                        icon="💧"
                    />
                </div>
            </div>

            {/* Injection Tracker Card */}
            <div className="stagger-3 fade-in bg-white p-5 rounded-[32px] shadow-sm border border-slate-100 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-outfit">Próxima Aplicação</span>
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
                        Registrar Aplicação de Hoje
                    </Button>
                )}
            </div>

            {/* Intelligence Alerts */}
            <div className="space-y-3">
                {stats.isPlateau && (
                    <div className="stagger-1 fade-in bg-amber-50 border border-amber-100 p-4 rounded-[28px] flex items-center gap-3 animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                            <TrendingUp size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Alerta de Platô</p>
                            <p className="text-xs text-amber-600 font-medium leading-tight">Peso estável há 14 dias. Tente variar a rotina de exercícios ou hidratação.</p>
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
                            <p className="text-xs text-teal-600 font-medium leading-tight">Priorize refeições leves e densas em proteína: ovos, iogurte ou shake.</p>
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
                    {/* Água Card */}
                    <div className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center group transition-all relative overflow-hidden active:scale-95">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 mb-3 group-hover:scale-110 transition-transform">
                            <Droplet size={24} />
                        </div>
                        <p className="font-black text-slate-800 text-[10px] uppercase tracking-widest mb-1">Hidratação</p>
                        <p className="text-sm font-medium text-slate-400 mb-4">Meta: {user.settings?.waterGoal}L</p>

                        <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-2xl border border-slate-100">
                            <button
                                onClick={() => updateIntake('water', -0.2)}
                                className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-blue-500 transition-colors"
                            >
                                -
                            </button>
                            <span className="text-sm font-black text-slate-800 min-w-[40px] text-center italic">{dailyData.water}L</span>
                            <button
                                onClick={() => updateIntake('water', 0.2)}
                                className="w-8 h-8 rounded-xl bg-blue-500 shadow-lg shadow-blue-500/20 flex items-center justify-center text-white font-bold"
                            >
                                +
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
                            <div
                                className="h-full bg-blue-500 transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                style={{ width: `${Math.min(100, (dailyData.water / user.settings?.waterGoal) * 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Proteína Card */}
                    <div className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center group transition-all relative overflow-hidden active:scale-95">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 mb-3 group-hover:scale-110 transition-transform">
                            <Activity size={24} />
                        </div>
                        <p className="font-black text-slate-800 text-[10px] uppercase tracking-widest mb-1">Proteína</p>
                        <p className="text-sm font-medium text-slate-400 mb-4">Meta: {user.settings?.proteinGoal}g</p>

                        <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-2xl border border-slate-100">
                            <button
                                onClick={() => updateIntake('protein', -5)}
                                className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-orange-500 transition-colors"
                            >
                                -
                            </button>
                            <span className="text-sm font-black text-slate-800 min-w-[40px] text-center italic">{dailyData.protein}g</span>
                            <button
                                onClick={() => updateIntake('protein', 5)}
                                className="w-8 h-8 rounded-xl bg-orange-500 shadow-lg shadow-orange-500/20 flex items-center justify-center text-white font-bold"
                            >
                                +
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
                            <div
                                className="h-full bg-orange-500 transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                                style={{ width: `${Math.min(100, (dailyData.protein / user.settings?.proteinGoal) * 100)}%` }}
                            ></div>
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

                <div className="space-y-6 mb-8">
                    <div className="flex justify-between items-end px-1">
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Novo Registro</label>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                            <span className="text-xs font-black text-brand-600 uppercase tabular-nums">{newWeight} kg</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-2 pl-6 rounded-[28px] border-2 border-slate-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus-within:border-brand-500 transition-all">
                        <div className="flex-1 relative h-3">
                            <div className="absolute inset-0 bg-slate-50 rounded-full"></div>
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-brand-400 to-brand-600 rounded-full"
                                style={{ width: `${((parseFloat(newWeight) - 50) / (250 - 50)) * 100}%` }}
                            ></div>
                            <input
                                type="range"
                                min="50"
                                max="250"
                                step="0.1"
                                value={newWeight || user.currentWeight}
                                onChange={(e) => setNewWeight(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            {/* Custom Thumb Visual */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-white border-[5px] border-brand-600 rounded-full shadow-xl pointer-events-none transition-transform active:scale-125"
                                style={{ left: `calc(${((parseFloat(newWeight) - 50) / (250 - 50)) * 100}% - 14px)` }}
                            ></div>
                        </div>

                        <div className="w-24 relative flex-shrink-0">
                            <input
                                type="number"
                                value={newWeight}
                                onChange={(e) => setNewWeight(e.target.value)}
                                className="w-full bg-white border border-slate-100 rounded-[20px] py-4 text-center font-black text-brand-900 focus:ring-2 focus:ring-brand-500 text-xl shadow-sm tabular-nums"
                                step="0.1"
                            />
                        </div>
                    </div>
                </div>

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

            {/* Modal: Mapa de Injeção */}
            <Modal isOpen={showInjectionModal} onClose={() => setShowInjectionModal(false)} title="Confirmar Aplicação">
                <div className="space-y-4">
                    <div className="bg-slate-900 rounded-[28px] p-5 text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Dose a ser aplicada</p>
                            <p className="text-2xl font-black">{user.currentDose} <span className="text-sm font-medium text-white/40">({user.medicationId})</span></p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-4">Escolha o Local da Aplicação</label>
                        <BodySelector
                            selectedSiteId={selectedSiteId || injectionSuggestion.id}
                            onSelect={setSelectedSiteId}
                            suggestedSiteId={injectionSuggestion.id}
                            lastSiteId={user.doseHistory?.[0]?.siteId}
                        />
                    </div>

                    {user.doseHistory?.[0]?.siteId === (selectedSiteId || injectionSuggestion.id) && (
                        <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-3 animate-headShake">
                            <AlertBox type="warning" title="Atenção" message="Você usou este local na última aplicação. Recomenda-se a rotação." />
                        </div>
                    )}

                    <Button onClick={handleConfirmInjection} className="w-full py-5 rounded-[24px] text-lg font-black shadow-2xl">
                        Registrar Aplicação ✨
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
                        Perder mais de 1.5kg por semana de forma consistente pode indicar que você está perdendo **massa muscular** em vez de apenas gordura.
                    </p>
                    <div className="bg-brand-50 p-4 rounded-2xl border border-brand-100">
                        <h4 className="font-bold text-brand-700 text-xs uppercase mb-2">Como prevenir</h4>
                        <ul className="text-xs space-y-2 list-disc ml-4">
                            <li>Aumente a ingestão de proteínas (mínimo 1.2g/kg).</li>
                            <li>Inicie ou mantenha exercícios de resistência.</li>
                            <li>Garanta uma hidratação rigorosa (2.5L+).</li>
                        </ul>
                    </div>
                </div>
            </Modal>

            {/* Modal: Platô */}
            <Modal
                isOpen={showPlateauInfo}
                onClose={() => setShowPlateauInfo(false)}
                title="O que é o Platô?"
            >
                <div className="space-y-4 text-slate-600">
                    <p className="text-sm leading-relaxed">
                        O platô ocorre quando o corpo se adapta à nova ingestão calórica e estabiliza o peso. É uma parte natural de qualquer jornada de emagrecimento.
                    </p>
                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                        <h4 className="font-bold text-orange-700 text-xs uppercase mb-2">Dicas para quebrar</h4>
                        <ul className="text-xs space-y-2 list-disc ml-4">
                            <li>Varie os tipos de exercícios físicos.</li>
                            <li>Revise seu diário alimentar.</li>
                            <li>Tire novas medidas.</li>
                        </ul>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
