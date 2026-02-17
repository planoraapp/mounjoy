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
        <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl animate-slideUp">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"><X size={18} /></button>
                </div>
                {children}
            </div>
        </div>,
        document.body
    );
};
