import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingDown, Activity, Heart } from 'lucide-react';

const Charts = ({ userData }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h1 className="text-2xl font-bold font-outfit">Sua Evolução</h1>
                <p className="text-slate-500 text-sm">Acompanhe seu progresso semanal</p>
            </header>

            {/* Weight Chart */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold px-2">Histórico de Peso</h3>
                <div className="card-super bg-white h-[300px] p-2 pr-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={userData.history}>
                            <defs>
                                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10 }}
                                dy={10}
                            />
                            <YAxis
                                hide={true}
                                domain={['dataMin - 5', 'dataMax + 5']}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                labelStyle={{ fontWeight: 'bold', color: '#0d9488' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="weight"
                                stroke="#14b8a6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorWeight)"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* Other Metrics Cards */}
            <section className="grid grid-cols-2 gap-4">
                <div className="card-super bg-white p-5 space-y-2 hover:shadow-lg transition-all">
                    <div className="w-10 h-10 bg-teal-50 text-teal-500 rounded-xl flex items-center justify-center">
                        <Activity size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">IMC Atual</p>
                        <h4 className="text-xl font-bold">28.4</h4>
                    </div>
                    <p className="text-[10px] text-teal-600 font-bold bg-teal-50 inline-block px-2 py-0.5 rounded-full">Sobrepeso</p>
                </div>

                <div className="card-super bg-white p-5 space-y-2 hover:shadow-lg transition-all">
                    <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
                        <Heart size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Glicemia</p>
                        <h4 className="text-xl font-bold">94<span className="text-xs ml-1">mg/dl</span></h4>
                    </div>
                    <p className="text-[10px] text-green-600 font-bold bg-green-50 inline-block px-2 py-0.5 rounded-full">Normal</p>
                </div>
            </section>

            {/* Summary Stat */}
            <div className="card-super bg-slate-900 text-white p-6 flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Taxa de Perda</p>
                    <h4 className="text-lg font-bold">~1.5kg / semana</h4>
                </div>
                <div className="bg-brand/20 p-3 rounded-2xl text-brand">
                    <TrendingDown size={24} />
                </div>
            </div>
        </div>
    );
};

export default Charts;
