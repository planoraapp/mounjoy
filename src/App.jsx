import React, { useState, useEffect } from 'react';
import { Home, PenLine, BarChart3, Settings } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Logs from './components/Logs';
import Charts from './components/Charts';
import Profile from './components/Profile';
import Onboarding from './components/Onboarding';
import LandingPage from './components/LandingPage';

const NavItem = ({ icon: Icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`p-3 transition-all duration-300 ${active
            ? 'text-brand'
            : 'text-slate-400 hover:text-brand'
            }`}
    >
        <Icon size={26} strokeWidth={active ? 2.5 : 2} />
    </button>
);

const BRFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 14" className="w-full h-full">
        <rect width="20" height="14" fill="#009c3b" />
        <polygon points="10,1.5 18.5,7 10,12.5 1.5,7" fill="#FFDF00" />
        <circle cx="10" cy="7" r="3.2" fill="#002776" />
        <path d="M7.2,6.1 Q10,5.2 12.8,6.5" stroke="#ffffff" strokeWidth="0.7" fill="none" />
    </svg>
);

const USFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 14" className="w-full h-full">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <rect key={i} x="0" y={i * (14 / 13)} width="20" height={14 / 13} fill={i % 2 === 0 ? '#B22234' : '#FFFFFF'} />
        ))}
        <rect x="0" y="0" width="8" height="7.5" fill="#3C3B6E" />
        {[0, 1, 2, 3, 4].map(row =>
            [0, 1, 2, 3, 4, 5].slice(0, row % 2 === 0 ? 6 : 5).map((col, ci) => (
                <circle key={`${row}-${ci}`} cx={(row % 2 === 0 ? col * 1.33 + 0.67 : col * 1.33 + 1.33)} cy={row * 1.5 + 0.75} r="0.4" fill="white" />
            ))
        )}
    </svg>
);

const App = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('home');
    const [loading, setLoading] = useState(true);
    const [startedOnboarding, setStartedOnboarding] = useState(false);
    const [language, setLanguage] = useState('pt');

    useEffect(() => {
        const savedUser = localStorage.getItem('mounjoy_user2');
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            // Quick migration for existing users
            const migrated = {
                ...parsed,
                doseHistory: parsed.doseHistory || [],
                sideEffectsLogs: parsed.sideEffectsLogs || [],
                measurements: parsed.measurements || [],
                dailyIntakeHistory: parsed.dailyIntakeHistory || {},
                isMaintenance: parsed.isMaintenance || false,
                settings: {
                    remindersEnabled: true,
                    proteinGoal: 100,
                    waterGoal: 2.5,
                    ...parsed.settings
                }
            };
            setUser(migrated);
        }
        setLoading(false);
    }, []);

    const handleOnboardingComplete = (data) => {
        const now = new Date().toISOString();
        const newUser = {
            ...data,
            currentWeight: parseFloat(data.startWeight),
            history: [parseFloat(data.startWeight)],
            startDate: now,
            lastWeightDate: now,
            // New Structures for Scale
            doseHistory: [{
                date: now,
                dose: data.currentDose,
                medication: data.medicationId,
                site: 'Não registrado'
            }],
            sideEffectsLogs: [],
            measurements: [],
            dailyIntakeHistory: {}, // Format: { "YYYY-MM-DD": { water: 0, protein: 0 } }
            isMaintenance: false,
            settings: {
                remindersEnabled: true,
                proteinGoal: 100,
                waterGoal: 2.5
            }
        };
        setUser(newUser);
        localStorage.setItem('mounjoy_user2', JSON.stringify(newUser));
    };

    const handleReset = () => {
        localStorage.removeItem('mounjoy_user2');
        setUser(null);
        setActiveTab('home');
        setStartedOnboarding(false);
    };

    if (loading) return null;

    if (!user && !startedOnboarding) {
        return <LandingPage onStart={() => setStartedOnboarding(true)} />;
    }

    if (!user && startedOnboarding) {
        return <Onboarding onComplete={handleOnboardingComplete} />;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'home': return <Dashboard user={user} setUser={setUser} />;
            case 'logs': return <Logs user={user} />;
            case 'charts': return <Charts user={user} />;
            case 'profile': return <Profile user={user} onReset={handleReset} />;
            default: return <Dashboard user={user} setUser={setUser} />;
        }
    };

    const getWeekNumber = () => {
        const start = new Date(user.startDate);
        const now = new Date();
        const diffTime = Math.abs(now - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        return Math.ceil(diffDays / 7);
    };

    const medicationName = user.medicationId.charAt(0).toUpperCase() + user.medicationId.slice(1);

    return (
        <div className="min-h-screen bg-transparent pb-24 selection:bg-brand-100">
            {/* Minimalist Header */}
            <header className="px-6 py-6 flex justify-between items-center bg-transparent max-w-md mx-auto">
                <div>
                    <h1 className="text-2xl font-bold text-brand-900 tracking-tight">Olá, {user.name}</h1>
                    <p className="text-sm text-slate-500 font-semibold font-outfit">
                        Você está na {getWeekNumber()}ª semana em uso de {medicationName}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Language Switcher */}
                    <div className="relative group">
                        <button
                            onClick={() => setLanguage(l => l === 'pt' ? 'en' : 'pt')}
                            className="w-10 h-10 bg-white rounded-xl shadow-soft border border-slate-100 hover:shadow-lg transition-all overflow-hidden flex items-center justify-center active:scale-95"
                            title={language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
                        >
                            <div className="w-7 h-5 rounded-sm overflow-hidden">
                                {language === 'pt' ? <BRFlag /> : <USFlag />}
                            </div>
                        </button>
                        {/* Dropdown hint */}
                        <div className="absolute top-full right-0 mt-2 w-24 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50">
                            <button
                                onClick={() => setLanguage('pt')}
                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold transition-colors ${language === 'pt' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <div className="w-6 h-4 rounded-sm overflow-hidden shrink-0"><BRFlag /></div>
                                PT-BR
                            </button>
                            <button
                                onClick={() => setLanguage('en')}
                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold transition-colors ${language === 'en' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <div className="w-6 h-4 rounded-sm overflow-hidden shrink-0"><USFlag /></div>
                                EN-US
                            </button>
                        </div>
                    </div>

                    {/* Profile Avatar */}
                    <div
                        className="w-12 h-12 bg-white rounded-2xl shadow-soft flex items-center justify-center border border-slate-100 cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setActiveTab('profile')}
                    >
                        <span className="text-brand-600 font-bold text-lg">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="px-6 max-w-md mx-auto">
                {renderContent()}
            </main>

            {/* Bottom Navigation (Floating Dock Style) */}
            <nav className="fixed bottom-6 left-5 right-5 h-16 bg-white/90 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/50 flex justify-around items-center px-2 z-40 max-w-sm mx-auto">
                <NavItem icon={Home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
                <NavItem icon={PenLine} active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} />
                <NavItem icon={BarChart3} active={activeTab === 'charts'} onClick={() => setActiveTab('charts')} />
                <NavItem icon={Settings} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            </nav>
        </div>
    );
};

export default App;
