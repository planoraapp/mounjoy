import React, { useState, useMemo } from 'react';
import { Activity, Plus, Heart, Droplet, Lightbulb } from 'lucide-react';
import { Modal, Input, Button } from './ui/BaseComponents';
import AlertBox from './ui/AlertBox';

const TIPS = [
    "Beba pelo menos 2.5L de água para ajudar os rins a processar a quebra de gordura.",
    "Priorize proteínas em todas as refeições para evitar a perda de massa muscular.",
    "Se sentir náusea, experimente comer porções menores e evitar frituras.",
    "A constipação é comum; aumente a ingestão de fibras e considere um suplemento.",
    "Mantenha um sono regular; o descanso é fundamental para o equilíbrio hormonal."
];

const Dashboard = ({ user, setUser }) => {
    const [showWeightModal, setShowWeightModal] = useState(false);
    const [showSpeedInfo, setShowSpeedInfo] = useState(false);
    const [showPlateauInfo, setShowPlateauInfo] = useState(false);
    const [newWeight, setNewWeight] = useState('');

    const updateWeight = () => {
        if (!newWeight) return;
        const weightValue = parseFloat(newWeight);
        const updatedUser = {
            ...user,
            currentWeight: weightValue,
            history: [...user.history, weightValue]
        };
        setUser(updatedUser);
        localStorage.setItem('mounjoy_user2', JSON.stringify(updatedUser));
        setShowWeightModal(false);
        setNewWeight('');
    };

    const totalLoss = (user.history[0] - user.currentWeight).toFixed(1);

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
                message: `Você está perdendo em média ${speed.toFixed(1)}kg por semana. Cuidado com a perda de massa muscular (sarcopenia). Aumente o aporte de proteínas e consulte seu médico.`,
                onInfo: () => setShowSpeedInfo(true)
            });
        }

        const lastWeights = user.history.slice(-3);
        if (lastWeights.length >= 3 && lastWeights.every(v => v === lastWeights[0])) {
            insights.push({
                type: 'warning',
                title: 'Platô Identificado',
                message: 'Seu peso não mudou nos últimos 3 registros. Considere ajustar seu plano alimentar ou aumentar a atividade física.',
                onInfo: () => setShowPlateauInfo(true)
            });
        }

        return insights;
    }, [user.currentWeight, user.history, user.startDate]);

    const dailyTip = useMemo(() => {
        // Simple rotation based on the day of the year
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const day = Math.floor(diff / oneDay);
        return TIPS[day % TIPS.length];
    }, []);

    return (
        <div className="fade-in space-y-6 pb-6">
            {/* Health Insights Section */}
            {(healthInsights.length > 0 || dailyTip) && (
                <div className="space-y-3">
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

            {/* Weight Hero Card */}
            <div className="relative overflow-hidden rounded-[32px] p-6 text-white shadow-xl bg-gradient-to-br from-brand-500 to-brand-600">
                <div className="absolute -right-10 -top-10 opacity-10">
                    <Activity size={150} />
                </div>

                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <span className="text-teal-50 text-sm font-medium tracking-wide uppercase opacity-80 font-outfit">Peso Atual</span>
                        <div className="flex items-end gap-2 mt-1 mb-4">
                            <span className="text-5xl font-bold tracking-tighter">{user.currentWeight}</span>
                            <span className="text-xl font-medium mb-2 opacity-80">kg</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowWeightModal(true)}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-xl transition-colors"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                <div className="flex gap-3 relative z-10">
                    <div className="bg-black/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Activity size={12} /> Total: {totalLoss}kg
                    </div>
                    <div className="bg-black/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Activity size={12} /> Meta: {user.goalWeight}kg
                    </div>
                </div>
            </div>

            {/* Next Dose Card */}
            <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-outfit">Próxima Dose</span>
                    <div className="flex items-center gap-2 mt-1">
                        <h3 className="text-xl font-bold text-slate-800">{user.injectionDay}</h3>
                        <span className="text-sm text-slate-500 font-medium">(Semana 1)</span>
                    </div>
                    <p className="text-brand font-bold bg-brand-50 inline-block px-2 py-0.5 rounded-md mt-1 border border-brand-100 text-sm">
                        {user.currentDose}
                    </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand border border-brand-100">
                    <Heart size={24} />
                </div>
            </div>

            {/* Daily Wellness */}
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 ml-1 font-outfit">Daily Wellness</h3>
                <div className="space-y-3">
                    <div className="bg-white p-4 rounded-[24px] border border-slate-100 flex items-center justify-between group hover:bg-brand-50/30 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                <Droplet size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-700 text-sm">Hidratação</p>
                                <p className="text-xs text-slate-400">Meta: {(user.currentWeight * 0.035).toFixed(1)}L</p>
                            </div>
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-brand"></div>
                    </div>

                    <div className="bg-white p-4 rounded-[24px] border border-slate-100 flex items-center justify-between group hover:bg-brand-50/30 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                                <Activity size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-700 text-sm">Proteína</p>
                                <p className="text-xs text-slate-400">Foco em saciedade</p>
                            </div>
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-brand"></div>
                    </div>
                </div>
            </div>

            {/* Weight Update Modal */}
            <Modal isOpen={showWeightModal} onClose={() => setShowWeightModal(false)} title="Atualizar Peso">
                <p className="text-sm text-slate-500 mb-4">Último registro: {user.currentWeight}kg</p>
                <Input
                    label="Novo Peso"
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="00.0"
                    suffix="kg"
                    step="0.1"
                    min="20"
                />
                <Button onClick={updateWeight} className="w-full">Salvar Progresso</Button>
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
                            <li>Aumente a ingestão de proteínas (ovos, carnes magras, whey).</li>
                            <li>Inicie ou mantenha exercícios de resistência (musculação).</li>
                            <li>Garanta uma hidratação rigorosa.</li>
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
                            <li>Revise seu diário alimentar (atenção aos ultraprocessados).</li>
                            <li>Tire novas medidas (às vezes você está perdendo medidas, mas não peso).</li>
                        </ul>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
