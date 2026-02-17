import React from 'react';
import { Droplet, Cookie, Calendar, ChevronRight, User } from 'lucide-react';

const Dashboard = ({ userData }) => {
    const weightProgress = ((userData.startWeight - userData.currentWeight) / (userData.startWeight - userData.goalWeight)) * 100;
    const totalLost = (userData.startWeight - userData.currentWeight).toFixed(1);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Olá, {userData.name}</h1>
                    <p className="text-slate-500 text-sm">Faltam {(userData.currentWeight - userData.goalWeight).toFixed(1)}kg para sua meta</p>
                </div>
                <div className="w-12 h-12 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center text-brand">
                    <User size={24} />
                </div>
            </header>

            {/* Hero Card */}
            <div className="card-super bg-gradient-to-br from-brand to-brand-dark text-white p-6 shadow-brand/40">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="opacity-80 text-xs font-medium uppercase tracking-wider">Peso Atual</p>
                        <h2 className="text-4xl font-bold mt-1">{userData.currentWeight}<span className="text-lg opacity-80 ml-1">kg</span></h2>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                        -{totalLost}kg total
                    </div>
                </div>

                {/* Simple Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span>{userData.startWeight}kg</span>
                        <span>Meta: {userData.goalWeight}kg</span>
                    </div>
                    <div className="h-2.5 bg-black/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full shadow-sm transition-all duration-1000 ease-out"
                            style={{ width: `${Math.min(100, weightProgress)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Next Dose Widget */}
            <div className="card-super flex items-center gap-4 bg-white hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-accent/10 border border-accent/20 rounded-[22px] flex items-center justify-center text-accent">
                    <Calendar size={28} />
                </div>
                <div className="flex-1">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Próxima Dose • {userData.dose}</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">{userData.nextDoseDay}, 12 Out</h3>
                        <button className="text-brand hover:bg-brand/5 p-1 rounded-lg transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Daily Wellness Checklist */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold px-2">Bem-estar diário</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="card-super p-5 flex flex-col gap-3">
                        <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-500">
                            <Droplet size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Água</p>
                            <p className="text-xs text-slate-500">1.2L / 2L</p>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 w-[60%] rounded-full"></div>
                        </div>
                    </div>

                    <div className="card-super p-5 flex flex-col gap-3">
                        <div className="w-10 h-10 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center text-orange-500">
                            <Cookie size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Proteína</p>
                            <p className="text-xs text-slate-500">45g / 80g</p>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-400 w-[55%] rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Action */}
            <div className="pt-4 flex justify-center">
                <button className="pill-button-primary w-full max-w-[240px]">
                    Novo registro
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
