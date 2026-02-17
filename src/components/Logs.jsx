import React, { useState } from 'react';
import { Smile, Meh, Frown, Angry, Save } from 'lucide-react';

const Logs = () => {
    const [nausea, setNausea] = useState(null);
    const [foodNoise, setFoodNoise] = useState(5);
    const [notes, setNotes] = useState('');

    const nauseaLevels = [
        { id: 'zero', label: 'Zero', icon: Smile, color: 'text-green-500', bg: 'bg-green-50' },
        { id: 'leve', label: 'Leve', icon: Meh, color: 'text-yellow-500', bg: 'bg-yellow-50' },
        { id: 'media', label: 'Média', icon: Frown, color: 'text-orange-500', bg: 'bg-orange-50' },
        { id: 'forte', label: 'Forte', icon: Angry, color: 'text-red-500', bg: 'bg-red-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h1 className="text-2xl font-bold font-outfit">Diário de Sintomas</h1>
                <p className="text-slate-500 text-sm">Como você está se sentindo hoje?</p>
            </header>

            {/* Nausea Tracker */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold px-2">Nível de Náusea</h3>
                <div className="grid grid-cols-4 gap-3">
                    {nauseaLevels.map((level) => {
                        const Icon = level.icon;
                        const isActive = nausea === level.id;
                        return (
                            <button
                                key={level.id}
                                onClick={() => setNausea(level.id)}
                                className={`card-super p-4 flex flex-col items-center gap-2 transition-all duration-300 ${isActive ? `ring-2 ring-brand ${level.bg}` : 'bg-white'
                                    }`}
                            >
                                <Icon size={24} className={isActive ? level.color : 'text-slate-400'} />
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {level.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Food Noise Slider */}
            <section className="space-y-4">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-lg font-bold">Ruído Alimentar</h3>
                    <span className="text-brand font-bold bg-brand/10 px-3 py-1 rounded-full text-sm">{foodNoise}/10</span>
                </div>
                <div className="card-super bg-white p-6">
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={foodNoise}
                        onChange={(e) => setFoodNoise(e.target.value)}
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand"
                    />
                    <div className="flex justify-between mt-3 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                        <span>Silencioso</span>
                        <span>Intenso</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                        O "ruído alimentar" refere-se a pensamentos intrusivos e obsessão por comida ao longo do dia.
                    </p>
                </div>
            </section>

            {/* Notes */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold px-2">Notas Complementares</h3>
                <div className="card-super bg-white p-2">
                    <textarea
                        className="w-full p-4 bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-300 min-h-[120px] resize-none"
                        placeholder="Algum outro sintoma ou observação?"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>
            </section>

            {/* Save Button */}
            <div className="pt-4 flex justify-center">
                <button className="pill-button-primary w-full flex items-center justify-center gap-2">
                    <Save size={20} />
                    Salvar Registro
                </button>
            </div>
        </div>
    );
};

export default Logs;
