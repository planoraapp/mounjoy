import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "py-3 px-6 rounded-2xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
    const variants = {
        primary: "bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40",
        secondary: "bg-white text-slate-700 border border-slate-200 shadow-sm hover:border-teal-200 hover:bg-teal-50",
        ghost: "bg-transparent text-slate-500 hover:text-teal-600",
        danger: "bg-red-50 text-red-500 border border-red-100 hover:bg-red-100"
    };

    return (
        <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export const Card = ({ children, className = '', onClick }) => (
    <div onClick={onClick} className={`bg-white/80 backdrop-blur-md border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] p-5 ${className}`}>
        {children}
    </div>
);

export const Input = ({ label, value, onChange, type = "text", placeholder, suffix, ...props }) => (
    <div className="mb-4">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">{label}</label>
        <div className="relative">
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder:text-slate-300 shadow-sm"
                {...props}
            />
            {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">{suffix}</span>}
        </div>
    </div>
);

export const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-lg sm:max-w-sm rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto hide-scrollbar relative">
                {/* Mobile Handle */}
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden -mt-2" />

                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 py-1">
                    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"><X size={18} /></button>
                </div>
                <div className="pb-4">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export const CircularProgress = ({ value, max, label, icon: Icon, color = "teal" }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const colors = {
        teal: "text-teal-500",
        blue: "text-blue-500",
        orange: "text-orange-500"
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-slate-100"
                    />
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        style={{
                            strokeDashoffset: offset,
                            transition: 'stroke-dashoffset 1s ease-out'
                        }}
                        className={`${colors[color]} stroke-round`}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {typeof Icon === 'string' ? (
                        <span className="text-xl mb-0.5">{Icon}</span>
                    ) : (
                        <Icon size={20} className={colors[color]} />
                    )}
                    <span className="text-[10px] font-black text-slate-800">{percentage.toFixed(0)}%</span>
                </div>
            </div>
            {label && <span className="text-[10px] font-bold text-white uppercase tracking-widest leading-none text-center">{label}</span>}
        </div>
    );
};

export const Slider = ({ label, value, onChange, min, max, step, suffix }) => {
    const percentage = ((parseFloat(value) - min) / (max - min)) * 100;

    return (
        <div className="mb-8">
            <div className="flex justify-between items-end px-1 mb-4">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</label>
                <div className="flex items-center gap-1.5 focus-within:scale-110 transition-transform">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                    <span className="text-xl font-black text-teal-600 uppercase tabular-nums">
                        {value} <span className="text-xs ml-0.5">{suffix}</span>
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-2 pl-6 rounded-[28px] border-2 border-slate-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus-within:border-teal-500 transition-all">
                <div className="flex-1 relative h-3">
                    <div className="absolute inset-0 bg-slate-50 rounded-full"></div>
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"
                        style={{ width: `${percentage}%` }}
                    ></div>
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-white border-[5px] border-teal-600 rounded-full shadow-xl pointer-events-none transition-transform active:scale-125"
                        style={{ left: `calc(${percentage}% - 14px)` }}
                    ></div>
                </div>

                <div className="w-24 relative flex-shrink-0">
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full bg-white border border-slate-100 rounded-[20px] py-4 text-center font-black text-teal-900 focus:ring-2 focus:ring-teal-500 text-xl shadow-sm tabular-nums"
                        step={step}
                    />
                </div>
            </div>
        </div>
    );
};
