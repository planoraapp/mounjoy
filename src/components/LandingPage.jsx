import React from 'react';
import { Activity, ShieldCheck, Zap, Heart, ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { Button } from './ui/BaseComponents';

const LandingPage = ({ onStart }) => {
    return (
        <div className="min-h-screen bg-[#f8fafc] overflow-x-hidden font-outfit selection:bg-brand-100">
            {/* Decorative Background Elements */}
            <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-100/30 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-100/20 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Hero Section */}
            <section className="relative px-6 pt-16 pb-12 text-center max-w-md mx-auto">
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 mb-6 animate-fadeIn">
                    <Heart className="text-red-500" size={16} />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Seu Companheiro na Jornada Metabólica</span>
                </div>

                <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6 animate-slideUp">
                    Bem-estar Premium <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-500">para sua evolução.</span>
                </h1>

                <p className="text-slate-500 text-lg font-medium leading-relaxed mb-10 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                    O suporte clinicamente orientado para usuários de Mounjaro, Ozempic e protocolos de GLP-1. Viva o emagrecimento com segurança.
                </p>

                <div className="flex flex-col gap-4 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                    <Button onClick={onStart} className="py-6 text-xl shadow-xl shadow-brand-500/20">
                        Começar meu Protocolo <ArrowRight size={20} />
                    </Button>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Design Minimalista • Suporte Clínico • 100% Privado</p>
                </div>
            </section>

            {/* Science & Safety Sections */}
            <section className="px-6 py-12 space-y-12 max-w-md mx-auto">
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold text-slate-800">Ciência em cada detalhe</h2>
                    <div className="h-1 w-12 bg-brand mx-auto mt-2 rounded-full"></div>
                </div>

                {/* Feature 1: Health Guard */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                            <ShieldCheck size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Seu "Guarda-Costas" de Saúde</h3>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        O grande diferencial do Mounjoy é a segurança. Monitoramos a velocidade do seu emagrecimento para prevenir a **sarcopenia** (perda muscular) e o efeito platô.
                    </p>
                </div>

                {/* Feature 2: Intelligent Protocol */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-50 text-brand rounded-xl flex items-center justify-center">
                            <Zap size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Gestão Inteligente de Ciclo</h3>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        Esqueça palpites. O Mounjoy conhece as dosagens reais (Mounjaro 2.5mg, Ozempic 0.25mg...) e te avisa exatamente quando é sua próxima aplicação.
                    </p>
                </div>

                {/* Feature 3: Specifc GLP-1 Habits */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                            <Activity size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Hábitos que Importam</h3>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        Cálculo dinâmico de hidratação (Peso x 35ml) e checklists de proteína. Evite efeitos colaterais comuns e proteja seus rins durante o tratamento.
                    </p>
                </div>

                {/* Experience Section */}
                <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-100 text-center space-y-4">
                    <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto text-brand mb-2">
                        <Info size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Estética "Medical Spa"</h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        Uma interface desenhada para reduzir a ansiedade. Tons suaves de Teal e formas orgânicas para uma jornada visualmente calma e profissional.
                    </p>
                </div>
            </section>

            {/* CTA Final */}
            <section className="bg-brand-900 text-white px-6 py-16 text-center">
                <div className="max-w-md mx-auto space-y-8">
                    <h2 className="text-3xl font-bold tracking-tight">Não apenas anote números. <br /><span className="text-brand-300">Garanta sua saúde.</span></h2>

                    <div className="flex flex-col gap-3">
                        <Button onClick={onStart} className="w-full bg-white text-brand-900 font-bold hover:bg-brand-50 border-none py-5">
                            Criar meu perfil premium
                        </Button>
                        <p className="text-[10px] text-brand-300 font-bold uppercase">Acesso imediato • Sem anúncios</p>
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
