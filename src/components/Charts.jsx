import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    Filler
} from 'chart.js';
import { Activity, TrendingUp, Calendar } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    ChartTooltip,
    Legend,
    Filler
);

const Charts = ({ user }) => {
    const [view, setView] = useState('weight'); // 'weight' or 'glucose'

    const glucoseHistory = [95, 102, 88, 92]; // Mocked glucose data

    const data = {
        labels: user.history.map((_, i) => `Sem ${i + 1}`),
        datasets: [{
            label: view === 'weight' ? 'Peso (kg)' : 'Glicemia (mg/dL)',
            data: view === 'weight' ? user.history : glucoseHistory,
            borderColor: view === 'weight' ? '#0d9488' : '#22c55e',
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                const color = view === 'weight' ? 'rgba(13, 148, 136, 0.5)' : 'rgba(34, 197, 94, 0.5)';
                gradient.addColorStop(0, color);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
                return gradient;
            },
            borderWidth: 3,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: view === 'weight' ? '#0d9488' : '#22c55e',
            pointBorderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
            fill: true,
            tension: 0.4
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1e293b',
                bodyColor: '#475569',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 16,
                displayColors: false,
                callbacks: {
                    label: (context) => {
                        const val = context.parsed.y;
                        const label = view === 'weight' ? `Peso: ${val}kg` : `Glicemia: ${val}mg/dL`;

                        // Calculate BMI for that index if weight view
                        if (view === 'weight') {
                            const bmi = (val / (user.height * user.height)).toFixed(1);
                            return [label, `IMC: ${bmi}`, "Estado: Em evolução"];
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                grid: { color: '#f1f5f9', drawBorder: false },
                ticks: {
                    font: { family: 'Outfit', size: 10, weight: 'bold' },
                    color: '#94a3b8'
                }
            },
            x: {
                grid: { display: false },
                ticks: {
                    font: { family: 'Outfit', size: 10, weight: 'bold' },
                    color: '#94a3b8'
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
    };

    const heightInMeters = parseFloat(user.height);
    const imc = (user.currentWeight / (heightInMeters * heightInMeters)).toFixed(1);

    return (
        <div className="space-y-6 pb-24">
            <div className="flex justify-between items-end stagger-1 fade-in mt-2 ml-1">
                <h2 className="text-2xl font-bold font-outfit">Sua Evolução</h2>
                <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                    <button
                        onClick={() => setView('weight')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${view === 'weight' ? 'bg-white text-brand shadow-sm' : 'text-slate-400'}`}
                    >
                        Peso
                    </button>
                    <button
                        onClick={() => setView('glucose')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${view === 'glucose' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-400'}`}
                    >
                        Glicemia
                    </button>
                </div>
            </div>

            <div className="glass-panel p-5 rounded-[40px] shadow-soft stagger-2 fade-in">
                <div className="h-64 w-full">
                    <Line data={data} options={options} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 stagger-3 fade-in">
                <div className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-100 group hover:border-green-200 transition-colors">
                    <div className="w-10 h-10 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Activity size={20} />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-outfit mb-1">Glicemia Média</p>
                    <p className="text-2xl font-bold text-slate-800">92 <span className="text-xs font-medium text-slate-400">mg/dL</span></p>
                </div>

                <div className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-100 group hover:border-blue-200 transition-colors">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <TrendingUp size={20} />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-outfit mb-1">IMC Atual</p>
                    <p className="text-2xl font-bold text-slate-800">{imc}</p>
                </div>
            </div>

            {/* Dose History (Mini View) */}
            <div className="bg-slate-900 rounded-[32px] p-6 text-white stagger-4 fade-in">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">Histórico de Doses</p>
                        <p className="text-sm font-bold">Protocolo Tirzepatida</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                        <span className="text-white/60 font-medium">Semana 1</span>
                        <span className="font-bold">2.5 mg</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-white/40">
                        <span className="font-medium">Semana 2</span>
                        <span className="font-bold">Em breve</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Charts;
