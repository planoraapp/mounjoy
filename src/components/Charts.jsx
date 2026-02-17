import React from 'react';
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
import { Activity, TrendingUp } from 'lucide-react';

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
    const data = {
        labels: user.history.map((_, i) => `Sem ${i + 1}`),
        datasets: [{
            label: 'Peso (kg)',
            data: user.history,
            borderColor: '#0d9488',
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, 'rgba(13, 148, 136, 0.5)');
                gradient.addColorStop(1, 'rgba(13, 148, 136, 0.0)');
                return gradient;
            },
            borderWidth: 3,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#0d9488',
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
            legend: { display: false }
        },
        scales: {
            y: {
                grid: { color: '#f1f5f9', drawBorder: false },
                ticks: {
                    font: { family: 'Outfit', size: 10 },
                    color: '#94a3b8'
                }
            },
            x: {
                grid: { display: false },
                ticks: {
                    font: { family: 'Outfit', size: 10 },
                    color: '#94a3b8'
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
    };

    // IMC Simple calculation
    const heightInMeters = parseFloat(user.height);
    const imc = (user.currentWeight / (heightInMeters * heightInMeters)).toFixed(1);

    return (
        <div className="fade-in">
            <h2 className="text-xl font-bold mb-5 ml-1 font-outfit">Sua Evolução</h2>

            <div className="glass-panel p-5 rounded-[32px] mb-6 shadow-soft">
                <div className="h-64 w-full">
                    <Line data={data} options={options} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-3">
                        <Activity size={20} />
                    </div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider font-outfit">Glicemia</p>
                    <p className="text-xl font-bold text-slate-800">92 <span className="text-xs font-normal text-slate-400">mg/dL</span></p>
                </div>
                <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                        <TrendingUp size={20} />
                    </div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider font-outfit">IMC Atual</p>
                    <p className="text-xl font-bold text-slate-800">{imc}</p>
                </div>
            </div>
        </div>
    );
};

export default Charts;
