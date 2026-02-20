import React, { useState } from 'react';
import { Activity, ArrowRight, Check, Syringe, Droplet, Info } from 'lucide-react';
import { Button, Input, Slider } from './ui/BaseComponents';
import { MOCK_MEDICATIONS } from '../constants/medications';

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [data, setData] = useState({
        name: '',
        height: '1.70',
        startWeight: '80.0',
        goalWeight: '70.0',
        medicationId: '',
        currentDose: '',
        injectionDay: 'Segunda-feira'
    });

    const [filterAdmin, setFilterAdmin] = useState('all'); // weekly, daily_inj, daily_oral
    const [filterFocus, setFilterFocus] = useState('all'); // weight, diabetes
    const [selectedSubstance, setSelectedSubstance] = useState(null);

    const handleSubstanceClick = (substance) => {
        setSelectedSubstance(selectedSubstance === substance ? null : substance);
    };

    const handleChange = (field, value) => {
        setData({ ...data, [field]: value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const filteredMeds = MOCK_MEDICATIONS.filter(med => {
        const matchesAdmin =
            filterAdmin === 'all' ||
            (filterAdmin === 'weekly' && med.route === 'injectable' && med.frequency === 'weekly') ||
            (filterAdmin === 'daily_inj' && med.route === 'injectable' && med.frequency === 'daily') ||
            (filterAdmin === 'daily_oral' && med.route === 'oral');

        const matchesFocus = filterFocus === 'all' || med.focus === filterFocus;

        return matchesAdmin && matchesFocus;
    });

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

        // Step 1: Name Only
        <div className="flex flex-col h-full pt-10 fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Sobre você</h2>
            <Input label="Como podemos te chamar?" placeholder="Seu nome" value={data.name} onChange={(e) => handleChange('name', e.target.value)} />
            <div className="mt-auto">
                <Button onClick={nextStep} className="w-full" disabled={!data.name}>Próximo</Button>
            </div>
        </div>,

        // Step 2: Current Physical Data (Sliders)
        <div className="flex flex-col h-full pt-10 fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Seus Dados</h2>
            <Slider
                label="Peso Atual"
                value={data.startWeight}
                onChange={(v) => handleChange('startWeight', v)}
                min={40}
                max={250}
                step={0.1}
                suffix="kg"
            />
            <Slider
                label="Altura"
                value={data.height}
                onChange={(v) => handleChange('height', v)}
                min={1.0}
                max={2.3}
                step={0.01}
                suffix="m"
            />
            <div className="mt-auto flex gap-3">
                <Button variant="ghost" onClick={prevStep}>Voltar</Button>
                <Button onClick={nextStep} className="flex-1">Próximo</Button>
            </div>
        </div>,

        // Step 3: Goal Weight (Slider)
        <div className="flex flex-col h-full pt-10 fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Sua Meta</h2>
            <Slider
                label="Meta de Peso"
                value={data.goalWeight}
                onChange={(v) => handleChange('goalWeight', v)}
                min={40}
                max={200}
                step={0.1}
                suffix="kg"
            />
            <div className="mt-auto flex gap-3">
                <Button variant="ghost" onClick={prevStep}>Voltar</Button>
                <Button onClick={nextStep} className="flex-1">Próximo</Button>
            </div>
        </div>,

        // Step 4: Medication Selection (Focused Interaction)
        <div className="flex flex-col h-full pt-10 fade-in relative">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Qual seu protocolo?</h2>

            {/* Filter UI - Persistent during Focus Mode */}
            <div className={`transition-all duration-300 mb-6`}>
                <div className="space-y-4">
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Via de Administração</span>
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                { id: 'all', label: 'Todos' },
                                { id: 'weekly', label: 'Injeção Semanal' },
                                { id: 'daily_inj', label: 'Injeção Diária' },
                                { id: 'daily_oral', label: 'Comprimido' }
                            ].map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setFilterAdmin(f.id)}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${filterAdmin === f.id ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-400 border-slate-100 hover:border-teal-200'
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Objetivo Principal</span>
                        <div className="flex gap-1.5">
                            {[
                                { id: 'all', label: 'Todos' },
                                { id: 'weight', label: 'Perda de Peso' },
                                { id: 'diabetes', label: 'Glicose / Diabetes' }
                            ].map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setFilterFocus(f.id)}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${filterFocus === f.id ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-400 border-slate-100 hover:border-teal-200'
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Click outside to reset selection */}
            {selectedSubstance && (
                <div
                    className="fixed inset-0 z-25"
                    onClick={() => setSelectedSubstance(null)}
                />
            )}

            <div className={`grid transition-all duration-500 gap-3 overflow-y-auto pb-40 max-h-[60vh] hide-scrollbar pr-1 relative ${selectedSubstance ? 'z-30 pointer-events-none' : 'z-20'
                } ${selectedSubstance ? 'grid-cols-1 items-center justify-center' : 'grid-cols-2'}`}>
                {Object.entries(
                    filteredMeds.reduce((acc, med) => {
                        (acc[med.substance] = acc[med.substance] || []).push(med);
                        return acc;
                    }, {})
                ).map(([substance, meds]) => {
                    const isFocused = selectedSubstance === substance;
                    const hasSelection = meds.some(m => m.id === data.medicationId);

                    if (selectedSubstance && !isFocused) return null;

                    return (
                        <div
                            key={substance}
                            onClick={() => handleSubstanceClick(substance)}
                            className={`p-4 rounded-[32px] transition-all duration-500 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden h-fit min-h-[100px] cursor-pointer ${isFocused
                                ? 'bg-teal-50 border-teal-600 border-2 ring-2 ring-teal-500/5 scale-105 my-4 shadow-xl z-30 w-full max-w-[210px] mx-auto pointer-events-auto'
                                : 'bg-white border-white border-2 hover:border-slate-100'
                                } ${!selectedSubstance ? 'opacity-100' : ''}`}
                        >
                            {(hasSelection || isFocused) && (
                                <div className={`absolute top-3 right-3 rounded-full bg-teal-600 flex items-center justify-center text-white shadow-sm transition-all duration-300 ${isFocused ? 'w-4 h-4 translate-x-1 -translate-y-1' : 'w-5 h-5'
                                    }`}>
                                    <Check size={isFocused ? 10 : 12} strokeWidth={3} />
                                </div>
                            )}

                            <div className="flex-1 flex flex-col items-center justify-center">
                                <h3 className={`font-black tracking-tight transition-all leading-tight ${isFocused ? 'text-xl text-teal-950 mb-4' : 'text-lg text-slate-800'
                                    }`}>
                                    {substance}
                                </h3>

                                {!isFocused && meds.find(m => m.id === data.medicationId) && (
                                    <div className="text-[10px] font-bold text-teal-600 mt-1 uppercase tracking-tight animate-in fade-in slide-in-from-top-1 duration-500">
                                        {meds.find(m => m.id === data.medicationId).brand}
                                    </div>
                                )}
                            </div>

                            {isFocused && (
                                <div className="flex transition-all duration-500 relative flex-col items-center gap-y-3 mt-4 max-h-96 opacity-100 w-full">
                                    {meds.map((med) => {
                                        const isSelected = data.medicationId === med.id;

                                        return (
                                            <button
                                                key={med.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleChange('medicationId', med.id);
                                                }}
                                                className={`font-bold transition-all duration-500 relative group py-2.5 px-6 rounded-2xl text-[12px] bg-white/80 hover:bg-white shadow-sm border border-slate-200 w-full active:scale-95 transform-gpu ${isSelected
                                                    ? 'text-teal-600 border-teal-200 bg-teal-50/50 max-w-[170px] scale-100'
                                                    : 'text-slate-600 hover:text-slate-800 border-transparent max-w-[190px] scale-105'
                                                    } ${isSelected ? 'shadow-md' : 'shadow-sm'}`}
                                                style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                                            >
                                                {med.brand}
                                                {isSelected && (
                                                    <div className="absolute -bottom-0.5 left-6 right-6 h-0.5 bg-teal-600 rounded-full scale-in" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Fixed Bottom Buttons - Optimized position */}
            <div className="absolute bottom-0 left-[-24px] right-[-24px] p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-12 z-40 border-t border-slate-100/50">
                <div className="flex gap-3 max-w-md mx-auto">
                    <Button variant="ghost" onClick={prevStep} className="px-8">Voltar</Button>
                    <Button onClick={nextStep} className="flex-1 shadow-lg shadow-teal-500/20" disabled={!data.medicationId}>Próximo</Button>
                </div>
            </div>
        </div>,

        // Step 5: Dosage & Schedule
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
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Dia da Aplicação / Consumo</label>
                <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
                    {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map(day => (
                        <button
                            key={day}
                            onClick={() => handleChange('injectionDay', day)}
                            className={`min-w-[50px] h-[50px] rounded-full flex items-center justify-center text-xs font-bold border transition-all ${data.injectionDay === day ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-400 border-slate-100'
                                }`}
                        >
                            {day.slice(0, 3)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-auto flex gap-3">
                <Button variant="ghost" onClick={prevStep}>Voltar</Button>
                <Button onClick={() => onComplete(data)} className="flex-1" disabled={!data.currentDose}>Finalizar</Button>
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
            <div className="flex-1 relative">
                {steps[step]}
            </div>
        </div>
    );
};

export default Onboarding;
