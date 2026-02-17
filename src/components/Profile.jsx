import React, { useState } from 'react';
import { Settings, Bell, LogOut, Check } from 'lucide-react';
import { Modal, Button } from './ui/BaseComponents';
import { MOCK_MEDICATIONS } from '../constants/medications';

const Profile = ({ user, onReset, setUser }) => {
    const [showProtocolModal, setShowProtocolModal] = useState(false);
    const [selectedMed, setSelectedMed] = useState(user.medicationId);
    const [selectedDose, setSelectedDose] = useState(user.currentDose);

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
