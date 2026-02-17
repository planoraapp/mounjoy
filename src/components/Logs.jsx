import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { Modal } from './ui/BaseComponents';

const Logs = () => {
    const [nausea, setNausea] = useState(null);
    const [foodNoise, setFoodNoise] = useState(3);
    const [showFoodNoiseInfo, setShowFoodNoiseInfo] = useState(false);

    const nauseaLevels = [
        { id: 'zero', emoji: '😊', label: 'Zero', hoverBg: 'hover:bg-brand-50', hoverBorder: 'hover:border-brand-200', activeRing: 'focus:ring-brand-500', activeText: 'group-hover:text-brand-600' },
        { id: 'leve', emoji: '😐', label: 'Leve', hoverBg: 'hover:bg-brand-50', hoverBorder: 'hover:border-brand-200', activeRing: 'focus:ring-brand-500', activeText: 'group-hover:text-brand-600' },
        { id: 'media', emoji: '🤢', label: 'Média', hoverBg: 'hover:bg-orange-50', hoverBorder: 'hover:border-orange-200', activeRing: 'focus:ring-orange-500', activeText: 'group-hover:text-orange-600' },
        { id: 'forte', emoji: '🤮', label: 'Forte', hoverBg: 'hover:bg-red-50', hoverBorder: 'hover:border-red-200', activeRing: 'focus:ring-red-500', activeText: 'group-hover:text-red-600' },
    ];

    return (
        <div className="fade-in">
            <h2 className="text-xl font-bold mb-5 ml-1">Como você está?</h2>

            <div className="glass-panel p-6 rounded-[32px] mb-6 shadow-soft">
                <label className="block text-sm font-bold text-slate-600 mb-4 uppercase tracking-wide">Nível de Náusea</label>
                <div className="grid grid-cols-4 gap-3">
                    {nauseaLevels.map((level) => (
                        <button
                            key={level.id}
                            onClick={() => setNausea(level.id)}
                            className={`aspect-square rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-1 transition-all group focus:ring-2 ${level.activeRing} ${level.hoverBg} ${level.hoverBorder} ${nausea === level.id ? 'ring-2' : ''}`}
                        >
                            <span className="text-2xl group-hover:scale-110 transition-transform">{level.emoji}</span>
                            <span className={`text-[10px] font-bold text-slate-400 ${level.activeText}`}>{level.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="glass-panel p-6 rounded-[32px] mb-6 shadow-soft">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <label className="block text-sm font-bold text-slate-600 uppercase tracking-wide">Food Noise</label>
                        <button
                            onClick={() => setShowFoodNoiseInfo(true)}
                            className="text-slate-400 hover:text-brand transition-colors"
                        >
                            <Info size={16} />
                        </button>
                    </div>
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded-md font-medium text-slate-500">Vontade de comer</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="10"
                    value={foodNoise}
                    onChange={(e) => setFoodNoise(e.target.value)}
                    className="custom-range mb-2"
                />
                <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                    <span>Silencioso</span>
                    <span>Moderado</span>
                    <span>Alto</span>
                </div>
            </div>

            <div className="glass-panel p-6 rounded-[32px] shadow-soft">
                <label className="block text-sm font-bold text-slate-600 mb-3 uppercase tracking-wide">Diário Rápido</label>
                <textarea
                    className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition-shadow resize-none"
                    rows="3"
                    placeholder="Ex: Senti um pouco de tontura ao levantar..."
                ></textarea>
            </div>

            <button className="mt-6 w-full btn-primary py-4 rounded-2xl font-bold text-lg shadow-lg shadow-brand-500/20">
                Salvar Registro
            </button>

            {/* Modal de Informação: Food Noise */}
            <Modal
                isOpen={showFoodNoiseInfo}
                onClose={() => setShowFoodNoiseInfo(false)}
                title="O que é Food Noise?"
            >
                <div className="space-y-4 text-slate-600">
                    <p className="text-sm leading-relaxed">
                        O "ruído alimentar" são aqueles pensamentos constantes e intrusivos sobre comida que podem dificultar o controle do peso.
                    </p>
                    <div className="space-y-2">
                        <div className="flex gap-3">
                            <div className="font-bold text-teal-600 text-sm min-w-[20px]">0-3</div>
                            <p className="text-xs">**Silencioso:** Você só pensa em comida quando está com fome física real.</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="font-bold text-orange-500 text-sm min-w-[20px]">4-7</div>
                            <p className="text-xs">**Moderado:** Pensamentos ocasionais sobre comida ou desejo por snacks específicos durante o dia.</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="font-bold text-red-500 text-sm min-w-[20px]">8-10</div>
                            <p className="text-xs">**Alto:** Pensamentos constantes sobre a próxima refeição, mesmo após comer.</p>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-400 italic">O GLP-1 costuma ajudar a silenciar esses pensamentos.</p>
                </div>
            </Modal>
        </div>
    );
};

export default Logs;
