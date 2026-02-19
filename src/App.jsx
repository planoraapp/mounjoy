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

const App = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('home');
    const [loading, setLoading] = useState(true);
    const [startedOnboarding, setStartedOnboarding] = useState(false);

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
                <div
                    className="w-12 h-12 bg-white rounded-2xl shadow-soft flex items-center justify-center border border-slate-100 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setActiveTab('profile')}
                >
                    <span className="text-brand-600 font-bold text-lg">{user.name.charAt(0).toUpperCase()}</span>
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
