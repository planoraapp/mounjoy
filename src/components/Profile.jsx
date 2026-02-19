import React, { useState } from 'react';
import { Settings, Bell, LogOut, Check, TrendingUp } from 'lucide-react';
import { Modal, Button } from './ui/BaseComponents';
import BodySelector from './ui/BodySelector';
import { suggestNextInjection, getSiteById } from '../services/InjectionService';
import { MOCK_MEDICATIONS } from '../constants/medications';

const Profile = ({ user, onReset, setUser }) => {
    const [showProtocolModal, setShowProtocolModal] = useState(false);
    const [showDoseModal, setShowDoseModal] = useState(false);
    const [selectedMed, setSelectedMed] = useState(user.medicationId);
    const [selectedDose, setSelectedDose] = useState(user.currentDose);
    const [selectedSiteId, setSelectedSiteId] = useState(null);

    const injectionSuggestion = React.useMemo(() => {
        return suggestNextInjection(user.doseHistory || []);
    }, [user.doseHistory]);

    const [showMeasureModal, setShowMeasureModal] = useState(false);
    const [measures, setMeasures] = useState({ waist: '', hip: '' });

    const handleUpdateProtocol = () => {
        const updatedUser = {
            ...user,
            medicationId: selectedMed,
            currentDose: selectedDose
        };
        setUser(updatedUser);
        localStorage.setItem('mounjoy_user2', JSON.stringify(updatedUser));
        setShowProtocolModal(false);
    };

    const handleSaveMeasures = () => {
        const updatedUser = {
            ...user,
            measurements: [{
                date: new Date().toISOString(),
                ...measures
            }, ...(user.measurements || [])]
        };
        setUser(updatedUser);
        localStorage.setItem('mounjoy_user2', JSON.stringify(updatedUser));
        setShowMeasureModal(false);
    };

    // ... handleAddDoseRecord ...

    const handleAddDoseRecord = () => {
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
        setShowDoseModal(false);
        setSelectedSiteId(null);
    };

    const currentMedInfo = MOCK_MEDICATIONS.find(m => m.id === selectedMed) || MOCK_MEDICATIONS[0];

    return (
        <div className="fade-in">
            <div className="text-center mt-8 mb-8">
                <div className="relative w-28 h-28 mx-auto mb-4">
                    <div className="absolute inset-0 bg-brand-200 rounded-full blur-xl opacity-50"></div>
                    <div className="relative w-full h-full bg-gradient-to-tr from-brand-600 to-brand-400 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 font-outfit">{user.name}</h2>
                <p className="text-brand-600 font-medium bg-brand-50 inline-block px-3 py-1 rounded-full text-sm mt-2">
                    Protocolo • {user.medicationId.charAt(0).toUpperCase() + user.medicationId.slice(1)} ({user.currentDose})
                </p>
            </div>

            <div className="space-y-3 pb-8">
                <button
                    onClick={() => setShowDoseModal(true)}
                    className="w-full bg-slate-900 text-white p-5 rounded-[28px] shadow-xl flex items-center justify-between group hover:scale-[1.02] transition-all"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <Check size={20} className="text-teal-400" />
                        </div>
                        <div className="text-left">
                            <span className="block font-black text-sm uppercase tracking-widest">Registrar Dose</span>
                            <span className="text-[10px] text-white/50 font-bold uppercase tracking-tight">Marcar aplicação de hoje</span>
                        </div>
                    </div>
                    <span className="text-white/30 group-hover:translate-x-1 transition-transform">›</span>
                </button>

                <button
                    onClick={() => setShowProtocolModal(true)}
                    className="w-full bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 flex items-center justify-between group hover:border-brand-200 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                            <Settings size={18} />
                        </div>
                        <span className="font-medium text-slate-700">Configurar Protocolo</span>
                    </div>
                    <span className="text-slate-300 group-hover:translate-x-1 transition-transform">›</span>
                </button>

                <button
                    onClick={() => setShowMeasureModal(true)}
                    className="w-full bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 flex items-center justify-between group hover:border-brand-200 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                            <TrendingUp size={18} />
                        </div>
                        <span className="font-medium text-slate-700">Progresso Corporal (Medidas)</span>
                    </div>
                    <span className="text-slate-300 group-hover:translate-x-1 transition-transform">›</span>
                </button>

                <button className="w-full bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 flex items-center justify-between group hover:border-brand-200 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                            <Bell size={18} />
                        </div>
                        <span className="font-medium text-slate-700">Lembretes</span>
                    </div>
                    <span className="text-slate-300 group-hover:translate-x-1 transition-transform">›</span>
                </button>

                <button
                    onClick={onReset}
                    className="w-full mt-8 p-4 rounded-[24px] border border-red-100 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors transition-all active:scale-95"
                >
                    <LogOut size={18} />
                    Resetar App (Apagar Dados)
                </button>
            </div>

            {/* Modal: Medidas Corporais */}
            <Modal isOpen={showMeasureModal} onClose={() => setShowMeasureModal(false)} title="Progresso Corporal">
                <div className="space-y-5">
                    <p className="text-xs text-slate-500 text-center mb-2">Monitore suas medidas para ver a perda de gordura além da balança.</p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cintura (cm)</label>
                            <input
                                type="number"
                                placeholder="00"
                                value={measures.waist}
                                onChange={(e) => setMeasures({ ...measures, waist: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-center font-bold text-slate-800 focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quadril (cm)</label>
                            <input
                                type="number"
                                placeholder="00"
                                value={measures.hip}
                                onChange={(e) => setMeasures({ ...measures, hip: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-center font-bold text-slate-800 focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                    </div>

                    <Button onClick={handleSaveMeasures} className="w-full">Salvar Medidas</Button>
                </div>
            </Modal>

            {/* Modal: Registrar Aplicação */}
            <Modal isOpen={showDoseModal} onClose={() => setShowDoseModal(false)} title="Nova Aplicação">
                <div className="space-y-4">
                    <div className="text-center bg-slate-50 p-3 rounded-2xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Dose Atual</p>
                        <p className="text-xl font-black text-slate-800">{user.currentDose} <span className="text-sm font-medium text-slate-400">({user.medicationId})</span></p>
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

                    <Button onClick={handleAddDoseRecord} className="w-full">Confirmar Aplicação</Button>
                </div>
            </Modal>

            {/* Modal de Configuração de Protocolo */}
            <Modal
                isOpen={showProtocolModal}
                onClose={() => setShowProtocolModal(false)}
                title="Configurar Protocolo"
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Medicamento</label>
                        <div className="grid grid-cols-2 gap-2">
                            {MOCK_MEDICATIONS.map(med => (
                                <button
                                    key={med.id}
                                    onClick={() => {
                                        setSelectedMed(med.id);
                                        setSelectedDose(med.doses[0]);
                                    }}
                                    className={`p-3 rounded-2xl border-2 text-sm font-bold transition-all ${selectedMed === med.id
                                        ? 'border-teal-700 bg-teal-700 text-white shadow-md'
                                        : 'border-slate-100 bg-white text-slate-500 hover:border-teal-200'
                                        }`}
                                >
                                    {med.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Dosagem</label>
                        <div className="grid grid-cols-3 gap-2">
                            {currentMedInfo.doses.map(dose => (
                                <button
                                    key={dose}
                                    onClick={() => setSelectedDose(dose)}
                                    className={`p-2 rounded-xl border text-xs font-bold transition-all ${selectedDose === dose
                                        ? 'border-teal-700 bg-teal-700 text-white shadow-md'
                                        : 'border-slate-100 bg-white text-slate-500 hover:border-teal-200'
                                        }`}
                                >
                                    {dose}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button onClick={handleUpdateProtocol} className="w-full mt-4">Salvar Alterações</Button>
                </div>
            </Modal>
        </div>
    );
};

export default Profile;
