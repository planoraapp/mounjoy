import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, PenTool, Image as ImageIcon, Scale, BookOpen, Droplet, Activity, X } from 'lucide-react';
import { Button } from './ui/BaseComponents';

const CalendarView = ({ user }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const monthName = currentMonth.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

    // Helper to check if a specific day has a weight logged (using history array and logic if we had dates, but we'll mock it based on history length for now)
    // Actually, mounjoy_user2 only has an array of weights `history` and `lastWeightDate`, not a full timeseries.
    // For visual purposes, we'll just style some days.

    return (
        <div className="flex flex-col gap-6 pb-24">
            {/* Header section */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 mt-2">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                        <CalendarIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Seu Calendário</h2>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Jornada Mounjoy</span>
                    </div>
                </div>

                {/* Photo Miniatures */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><ImageIcon size={12} /> Galeria de Evolução</span>
                        <span className="text-[10px] font-bold text-brand bg-brand-50 px-2 py-0.5 rounded-full">{user.photos?.length || 0} fotos</span>
                    </div>
                    {user.photos && user.photos.length > 0 ? (
                        <div className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
                            {user.photos.map((photo, idx) => (
                                <div key={idx} className="w-20 h-20 rounded-2xl bg-slate-100 shrink-0 snap-center overflow-hidden border-2 border-white shadow-sm relative">
                                    <img src={typeof photo === 'string' ? photo : photo.url} alt={`Evolução ${idx}`} className="w-full h-full object-cover" />
                                    <div className="absolute bottom-1 right-1 text-[8px] font-black text-white bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm">
                                        {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(new Date(photo.date || new Date())).replace('/', '-')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full py-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                            <ImageIcon size={20} className="mb-2 opacity-50" />
                            <span className="text-xs font-semibold">Nenhuma foto registrada</span>
                        </div>
                    )}
                </div>

                {/* Calendar Widget */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Scale size={12} /> Frequência de Pesagens</span>
                        <div className="flex items-center gap-2">
                            <button onClick={prevMonth} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-xs font-bold text-slate-800 capitalize w-24 text-center">{monthName}</span>
                            <button onClick={nextMonth} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                            <span key={i} className="text-[10px] font-black text-slate-400">{d}</span>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center">
                        {[...Array(firstDay)].map((_, i) => (
                            <div key={`empty-${i}`} className="h-10 rounded-xl" />
                        ))}
                        {[...Array(daysInMonth)].map((_, i) => {
                            const day = i + 1;
                            const isToday = day === new Date().getDate() && currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear();

                            // Mocking some logged weights for visual flair (every 5th day)
                            const hasLoggedWeight = day % 5 === 0 && day < new Date().getDate();

                            return (
                                <div
                                    key={day}
                                    onClick={() => {
                                        const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                        setSelectedDate(prev => prev && prev.getTime() === clickedDate.getTime() ? null : clickedDate);
                                    }}
                                    className={`h-10 rounded-xl flex flex-col items-center justify-center text-sm font-bold relative transition-all cursor-pointer hover:scale-110 scale-100 ${selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth.getMonth()
                                            ? 'bg-slate-800 text-white shadow-md'
                                            : isToday ? 'bg-indigo-500 text-white shadow-md' :
                                                hasLoggedWeight ? 'bg-indigo-50 text-indigo-700 font-black' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    {day}
                                    {hasLoggedWeight && <div className={`absolute bottom-1 w-1 h-1 rounded-full ${selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth.getMonth() ? 'bg-white' : 'bg-indigo-500'}`}></div>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Expanded Day Metrics */}
                <div className={`transition-all duration-300 overflow-hidden ${selectedDate ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
                    {selectedDate && (
                        <div className="pt-6 border-t border-slate-100 flex flex-col gap-4 text-slate-800 relative">
                            <button onClick={() => setSelectedDate(null)} className="absolute right-0 top-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors">
                                <X size={16} />
                            </button>
                            <div>
                                <h3 className="font-black text-slate-800 tracking-tight capitalize">
                                    {new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(selectedDate)}
                                </h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Resumo do Dia</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Scale size={14} /> Peso</span>
                                    <span className="text-xl font-black tabular-nums">
                                        {selectedDate.getDate() % 5 === 0 ? "82.4 kg" : "--"}
                                    </span>
                                </div>
                                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex flex-col gap-2">
                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5"><Droplet size={14} /> Hidratação</span>
                                    <span className="text-xl font-black tabular-nums text-blue-900">
                                        {selectedDate.getDate() % 2 === 0 ? "2.5 L" : "1.2 L"}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 flex flex-col gap-2 group cursor-pointer hover:bg-orange-100/70 transition-colors">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-1.5"><Activity size={14} /> Atividade</span>
                                    <ChevronRight size={14} className="text-orange-300 group-hover:text-orange-500 transition-colors" />
                                </div>
                                <span className="text-sm font-bold text-orange-900 leading-tight">
                                    {selectedDate.getDate() % 3 === 0
                                        ? "Caminhada leve registrada (30 min)."
                                        : "Nenhum exercício registrado neste dia."}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Thoughts Log Section */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 mt-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <BookOpen size={18} className="text-slate-500" />
                        <h3 className="font-bold text-slate-800">Diário de Pensamentos</h3>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 shadow-sm border border-slate-100 hover:bg-slate-100 transition-colors">
                        <PenTool size={14} />
                    </button>
                </div>

                <div className="space-y-3">
                    {/* Mock thought logs */}
                    <div className="w-full bg-slate-50 border-none rounded-2xl p-4 transition-shadow relative overflow-hidden group">
                        <p className="text-sm text-slate-700 italic mb-2">"Hoje senti muito menos fome durante a tarde, consegui focar melhor no trabalho."</p>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ontem, 18:30</span>
                    </div>

                    <div className="w-full bg-slate-50 border-none rounded-2xl p-4 transition-shadow relative overflow-hidden group">
                        <p className="text-sm text-slate-700 italic mb-2">"Tive um leve enjoo de manhã, preciso lembrar de comer devagar."</p>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">19 Fev, 09:15</span>
                    </div>
                </div>

                <Button className="w-full mt-4 bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-bold shadow-md">
                    Registrar Pensamento
                </Button>
            </div>

            {/* Day Metrics Modal */}
            <Modal
                isOpen={!!selectedDate}
                onClose={() => setSelectedDate(null)}
                title={selectedDate ? new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(selectedDate) : ''}
            >
                <div className="flex flex-col gap-4 text-slate-800">
                    <p className="text-sm text-slate-500 mb-2">Visão geral das métricas registradas neste dia.</p>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Scale size={14} /> Peso</span>
                            <span className="text-xl font-black tabular-nums">
                                {selectedDate && selectedDate.getDate() % 5 === 0 ? "82.4 kg" : "--"}
                            </span>
                        </div>
                        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex flex-col gap-2">
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5"><Droplet size={14} /> Hidratação</span>
                            <span className="text-xl font-black tabular-nums text-blue-900">
                                {selectedDate && selectedDate.getDate() % 2 === 0 ? "2.5 L" : "1.2 L"}
                            </span>
                        </div>
                    </div>

                    <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 flex flex-col gap-2">
                        <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-1.5"><Activity size={14} /> Atividade</span>
                        <span className="text-sm font-bold text-orange-900 leading-tight">
                            {selectedDate && selectedDate.getDate() % 3 === 0
                                ? "Caminhada leve registrada (30 min)."
                                : "Nenhum exercício registrado neste dia."}
                        </span>
                    </div>

                    <Button onClick={() => setSelectedDate(null)} className="w-full py-4 rounded-[20px] text-sm mt-2">
                        Fechar Histórico
                    </Button>
                </div>
            </Modal>

            {/* Additional Metrics snippet could go here */}
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default CalendarView;
