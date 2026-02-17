import React, { useState } from 'react';
import { Activity, ArrowRight, Check } from 'lucide-react';
import { Button, Input } from './ui/BaseComponents';
import { MOCK_MEDICATIONS } from '../constants/medications';

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [data, setData] = useState({
        name: '',
        height: '',
        startWeight: '',
        goalWeight: '',
        medicationId: '',
        currentDose: '',
        injectionDay: 'Domingo'
    });

    const handleChange = (field, value) => {
        let finalValue = value;
        if (field === 'height' && value.length >= 3 && !value.includes('.')) {
            const num = parseFloat(value);
            if (num > 3) { // Assume values > 3 are centimeters
                finalValue = (num / 100).toString();
            }
        }
        setData({ ...data, [field]: finalValue });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const steps = [
        // Step 0: Welcome
        <div className="flex flex-col h-full justify-center items-center text-center fade-in">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-6 text-teal-600 shadow-inner">
                <Activity size={48} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Bem-vindo ao Mounjoy</h1>
            <p className="text-slate-500 mb-8 max-w-xs">Seu companheiro diário na jornada de transformação e saúde metabólica.</p>
            <Button onClick={nextStep} className="w-full max-w-xs">Começar Configuração <ArrowRight size={18} /></Button>
        </div>,

        // Step 1: Basic Info
        <div className="flex flex-col h-full pt-10 fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Sobre você</h2>
            <Input label="Como podemos te chamar?" placeholder="Seu nome" value={data.name} onChange={(e) => handleChange('name', e.target.value)} />
            <Input label="Qual sua altura?" placeholder="1.75" type="number" suffix="m" value={data.height} onChange={(e) => handleChange('height', e.target.value)} step="0.01" min="0.5" max="2.5" />
            <div className="mt-auto">
                <Button onClick={nextStep} className="w-full" disabled={!data.name || !data.height}>Próximo</Button>
            </div>
        </div>,

        // Step 2: Weight Goals
        <div className="flex flex-col h-full pt-10 fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Suas Metas</h2>
            <p className="text-slate-400 text-sm mb-8">Vamos monitorar sua evolução juntos.</p>

            <Input label="Peso Atual" placeholder="00.0" type="number" suffix="kg" value={data.startWeight} onChange={(e) => handleChange('startWeight', e.target.value)} step="0.1" min="20" />
            <Input label="Meta de Peso" placeholder="00.0" type="number" suffix="kg" value={data.goalWeight} onChange={(e) => handleChange('goalWeight', e.target.value)} step="0.1" min="20" />

            <div className="mt-auto flex gap-3">
                <Button variant="ghost" onClick={prevStep}>Voltar</Button>
                <Button onClick={nextStep} className="flex-1" disabled={!data.startWeight}>Próximo</Button>
            </div>
        </div>,

        // Step 3: Medication Selection
        <div className="flex flex-col h-full pt-10 fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Qual seu protocolo?</h2>
            <div className="space-y-3 overflow-y-auto pb-4 max-h-[60vh]">
                {MOCK_MEDICATIONS.map((med) => (
                    <button
                        key={med.id}
                        onClick={() => handleChange('medicationId', med.id)}
                        className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${data.medicationId === med.id
                            ? 'border-teal-700 bg-teal-700 text-white shadow-md'
                            : 'border-white bg-white hover:border-teal-100 text-slate-800'
                            }`}
                    >
                        <div className="text-left">
                            <span className={`block font-bold ${data.medicationId === med.id ? 'text-white' : 'text-slate-800'}`}>{med.name}</span>
                            <span className={`text-[10px] font-bold uppercase ${data.medicationId === med.id ? 'text-teal-50' : 'text-slate-400'}`}>{med.substance}</span>
                        </div>
                        {data.medicationId === med.id && <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white"><Check size={14} /></div>}
                    </button>
                ))}
            </div>
            <div className="mt-auto flex gap-3 pt-4">
                <Button variant="ghost" onClick={prevStep}>Voltar</Button>
                <Button onClick={nextStep} className="flex-1" disabled={!data.medicationId}>Próximo</Button>
            </div>
        </div>,

        // Step 4: Dosage & Schedule
        <div className="flex flex-col h-full pt-10 fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Detalhes da Dose</h2>

            {data.medicationId && (
                <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Dosagem Atual</label>
                    <div className="grid grid-cols-3 gap-2">
                        {MOCK_MEDICATIONS.find(m => m.id === data.medicationId).doses.map((dose) => (
                            <button
                                key={dose}
                                onClick={() => handleChange('currentDose', dose)}
                                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${data.currentDose === dose ? 'bg-teal-700 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-100'
                                    }`}
                            >
                                {dose}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Dia da Aplicação</label>
                <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                        <button
                            key={day}
                            onClick={() => handleChange('injectionDay', day)}
                            className={`min-w-[50px] h-[50px] rounded-full flex items-center justify-center text-sm font-bold border ${data.injectionDay === day ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-400 border-slate-100'
                                }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-auto flex gap-3">
                <Button variant="ghost" onClick={prevStep}>Voltar</Button>
                <Button onClick={() => onComplete(data)} className="flex-1">Finalizar</Button>
            </div>
        </div>
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex flex-col">
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-200 rounded-full mb-6 overflow-hidden">
                <div
                    className="h-full bg-teal-500 transition-all duration-500 ease-out"
                    style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                />
            </div>
            {steps[step]}
        </div>
    );
};

export default Onboarding;
