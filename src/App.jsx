import React, { useState, useEffect } from 'react';
import { Home, PenLine, BarChart3, Settings, CalendarDays } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Logs from './components/Logs';
import Charts from './components/Charts';
import Profile from './components/Profile';
import CalendarView from './components/CalendarView';
import Onboarding from './components/Onboarding';
import LandingPage from './components/LandingPage';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';

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

const MainApp = () => {
    const { currentUser, logout } = useAuth();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('home');
    const [loading, setLoading] = useState(true);
    const [startedOnboarding, setStartedOnboarding] = useState(false);
    const [language, setLanguage] = useState('pt');

    useEffect(() => {
        // We still use local storage for profile data for now, 
        // but we reference the firebase uid to keep it isolated per user
        const savedUser = localStorage.getItem(`mounjoy_user_${currentUser?.uid}`);
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            setUser(parsed);
        }
        setLoading(false);
    }, [currentUser]);

    const handleOnboardingComplete = (data) => {
        const now = new Date().toISOString();
        const newUser = {
            ...data,
            uid: currentUser.uid,
            email: currentUser.email,
            currentWeight: parseFloat(data.startWeight),
            history: [parseFloat(data.startWeight)],
            startDate: now,
            lastWeightDate: now,
            doseHistory: [{
                date: now,
                dose: data.currentDose,
                medication: data.medicationId,
                site: 'Não registrado'
            }],
            sideEffectsLogs: [],
            measurements: [],
            dailyIntakeHistory: {},
            isMaintenance: false,
            settings: {
                remindersEnabled: true,
                proteinGoal: 100,
                waterGoal: 2.5
            }
        };
        setUser(newUser);
        localStorage.setItem(`mounjoy_user_${currentUser.uid}`, JSON.stringify(newUser));
    };

    const handleReset = async () => {
        await logout();
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
            case 'calendar': return <CalendarView user={user} />;
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
            <header className="px-6 py-6 flex justify-between items-center bg-transparent max-w-md mx-auto">
                <div>
                    <h1 className="text-2xl font-bold text-brand-900 tracking-tight">Olá, {user.name}</h1>
                    <p className="text-sm text-slate-500 font-semibold font-outfit">
                        Você está na {getWeekNumber()}ª semana em uso de {medicationName}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <button
                            onClick={() => setLanguage(l => l === 'pt' ? 'en' : 'pt')}
                            className="w-10 h-10 bg-white rounded-xl shadow-soft border border-slate-100 hover:shadow-lg transition-all overflow-hidden flex items-center justify-center active:scale-95"
                        >
                            <div className="w-7 h-5 rounded-sm overflow-hidden">
                                {language === 'pt' ? <BRFlag /> : <USFlag />}
                            </div>
                        </button>
                    </div>

                    <div
                        className="w-12 h-12 bg-white rounded-2xl shadow-soft flex items-center justify-center border border-slate-100 cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setActiveTab('profile')}
                    >
                        <span className="text-brand-600 font-bold text-lg">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                </div>
            </header>

            <main className="px-6 max-w-md mx-auto">
                {renderContent()}
            </main>

            <nav className="fixed bottom-6 left-5 right-5 h-16 bg-white/90 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/50 flex justify-around items-center px-2 z-40 max-w-sm mx-auto">
                <NavItem icon={Home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
                <NavItem icon={PenLine} active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} />
                <NavItem icon={CalendarDays} active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
                <NavItem icon={BarChart3} active={activeTab === 'charts'} onClick={() => setActiveTab('charts')} />
                <NavItem icon={Settings} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            </nav>
        </div>
    );
};

const AppContent = () => {
    const { currentUser } = useAuth();
    return currentUser ? <MainApp /> : <Login />;
};

const App = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
