import React from 'react';
import { Activity, ShieldCheck, Zap, Heart, ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { Button } from './ui/BaseComponents';

const LandingPage = ({ onStart, onLogin }) => {
    return (
        <div className="min-h-screen bg-[#f8fafc] overflow-x-hidden font-outfit selection:bg-brand-100">
            {/* Minimalist Landing Header */}
            <header className="px-6 py-6 flex justify-between items-center max-w-6xl mx-auto absolute top-0 left-0 right-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white font-black text-xl">M</div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">Mounjoy</span>
                </div>
                <button
                    onClick={onLogin}
                    className="px-6 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 text-slate-600 font-bold text-sm shadow-sm hover:shadow-md hover:bg-white transition-all active:scale-95"
                >
                    Entrar
                </button>
            </header>

            {/* Decorative Background Elements */}
            <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-100/30 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-100/20 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Hero Section */}
            <section className="relative px-6 pt-20 pb-16 text-center max-w-4xl mx-auto md:pt-32 md:pb-24">
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 mb-8 animate-fadeIn">
                    <Heart className="text-red-500" size={16} />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Seu Companheiro na Jornada Metabólica</span>
                </div>

                <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8 animate-slideUp md:text-7xl lg:text-8xl">
                    Bem-estar Premium <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-500">para sua evolução.</span>
                </h1>

                <p className="text-slate-500 text-lg font-medium leading-relaxed mb-12 animate-slideUp max-w-2xl mx-auto md:text-xl" style={{ animationDelay: '0.1s' }}>
                    O suporte clinicamente orientado para usuários de Mounjaro, Ozempic e protocolos de GLP-1. Viva o emagrecimento com segurança e suporte profissional.
                </p>

                <div className="flex flex-col items-center gap-6 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                    <Button onClick={onStart} className="py-7 px-10 text-xl shadow-xl shadow-brand-500/20 w-full max-w-md">
                        Começar meu Protocolo <ArrowRight size={20} />
                    </Button>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 opacity-60">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5"><ShieldCheck size={12} /> Design Minimalista</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5"><Activity size={12} /> Suporte Clínico</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5"><Heart size={12} /> 100% Privado</span>
                    </div>
                </div>
            </section>

            {/* Science & Safety Sections */}
            <section className="px-6 py-16 max-w-6xl mx-auto">
                <div className="text-center mb-16 px-4">
                    <h2 className="text-3xl font-bold text-slate-800 md:text-4xl">Ciência em cada detalhe</h2>
                    <div className="h-1.5 w-16 bg-brand mx-auto mt-4 rounded-full"></div>
                    <p className="mt-6 text-slate-500 font-medium max-w-xl mx-auto">
                        Desenvolvemos o Mounjoy para resolver os desafios biológicos e comportamentais únicos do tratamento com GLP-1.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* Feature 1: Health Guard */}
                    <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-50 relative group hover:shadow-xl transition-shadow">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">Seu "Guarda-Costas" de Saúde</h3>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                            O grande diferencial do Mounjoy é a segurança. Monitoramos a velocidade do seu emagrecimento para prevenir a **sarcopenia** (perda muscular) e o efeito platô indesejado.
                        </p>
                    </div>

                    {/* Feature 2: Intelligent Protocol */}
                    <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-50 relative group hover:shadow-xl transition-shadow">
                        <div className="w-12 h-12 bg-brand-50 text-brand rounded-2xl flex items-center justify-center mb-6">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">Gestão Inteligente de Ciclo</h3>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                            Esqueça palpites. O Mounjoy conhece as dosagens reais (Mounjaro 2.5mg, Ozempic 0.25mg...) e te avisa exatamente quando é sua próxima aplicação através de um widget intuitivo.
                        </p>
                    </div>

                    {/* Feature 3: Specifc GLP-1 Habits */}
                    <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-50 relative group hover:shadow-xl transition-shadow">
                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                            <Activity size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">Hábitos que Importam</h3>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                            Cálculo dinâmico de hidratação (Peso x 35ml) e checklists de proteína. Evite efeitos colaterais comuns e proteja seus rins e fígado durante todo o tratamento.
                        </p>
                    </div>
                </div>

                {/* Experience Section */}
                <div className="bg-gradient-to-br from-white to-brand-50/30 p-10 md:p-16 rounded-[48px] shadow-soft border border-white text-center space-y-6 max-w-4xl mx-auto">
                    <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto text-brand mb-4">
                        <Info size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 md:text-3xl">Estética "Medical Spa"</h3>
                    <p className="text-lg text-slate-500 leading-relaxed font-medium max-w-2xl mx-auto">
                        Uma interface desenhada especificamente para reduzir a ansiedade comum no tratamento. Tons suaves de Teal e formas orgânicas para uma jornada visualmente calma, premium e profissional.
                    </p>
                </div>
            </section>

            {/* CTA Final */}
            <section className="bg-brand-900 text-white px-6 py-24 text-center relative overflow-hidden">
                {/* Background elements for desktop */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>

                <div className="max-w-4xl mx-auto space-y-10 relative z-10">
                    <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">Não apenas anote números. <br /><span className="text-brand-300">Garanta sua saúde metabólica.</span></h2>

                    <div className="flex flex-col items-center gap-4">
                        <Button onClick={onStart} className="w-full max-w-md bg-white text-brand-900 font-bold hover:bg-brand-50 border-none py-6 text-xl">
                            Criar meu perfil premium
                        </Button>
                        <div className="flex items-center gap-8 opacity-60">
                            <div className="flex items-center gap-2"><CheckCircle2 size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Acesso imediato</span></div>
                            <div className="flex items-center gap-2"><CheckCircle2 size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Sem anúncios</span></div>
                            <div className="flex items-center gap-2"><CheckCircle2 size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Dados Seguro</span></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-6 py-12 text-center text-slate-400 text-xs font-medium">
                <p>© 2026 Mounjoy. Feito para quem busca a melhor versão.</p>
                <p className="mt-2 text-[10px] px-8 leading-relaxed italic">
                    O Mounjoy é uma ferramenta de suporte. Consulte sempre seu médico antes de tomar decisões sobre sua medicação.
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;
