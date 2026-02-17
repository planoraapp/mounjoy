import React, { useState } from 'react';
import { Home, ClipboardList, LineChart, User } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Logs from './components/Logs';
import Charts from './components/Charts';


// Custom data hook or context would go here, using mock for now
const userData = {
    name: "Usuário",
    startWeight: 115.0,
    currentWeight: 104.0,
    goalWeight: 90.0,
    dose: "5.0 mg",
    nextDoseDate: "2023-10-12", // ISO Format
    nextDoseDay: "Quinta",
    history: [
        { date: 'Sem 1', weight: 115.0 },
        { date: 'Sem 2', weight: 112.5 },
        { date: 'Sem 3', weight: 110.2 },
        { date: 'Sem 4', weight: 108.5 },
        { date: 'Sem 5', weight: 106.8 },
        { date: 'Sem 6', weight: 104.5 },
        { date: 'Sem 7', weight: 104.0 }
    ]
};

const NavItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-16 h-16 transition-all duration-300 ${active ? 'text-brand scale-110' : 'text-slate-400 hover:text-slate-600'
            }`}
    >
        <div className={`p-2 rounded-2xl ${active ? 'bg-brand/10' : ''}`}>
            <Icon size={24} strokeWidth={active ? 2.5 : 2} />
        </div>
        <span className="text-[10px] font-medium mt-1">{label}</span>
    </button>
);

const App = () => {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div className="min-h-screen pb-32">
            <main className="max-w-md mx-auto px-6 pt-10">
                {activeTab === 'home' && <Dashboard userData={userData} />}
                {activeTab === 'logs' && <Logs />}
                {activeTab === 'charts' && <Charts userData={userData} />}
                {activeTab === 'profile' && <div className="text-center py-20 text-slate-400 font-medium">Profile Content Coming Soon</div>}
            </main>

            {/* Floating Bottom Navigation */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                <nav className="glass-panel rounded-[32px] px-4 py-2 flex items-center gap-2 shadow-2xl">
                    <NavItem
                        icon={Home}
                        label="Home"
                        active={activeTab === 'home'}
                        onClick={() => setActiveTab('home')}
                    />
                    <NavItem
                        icon={ClipboardList}
                        label="Logs"
                        active={activeTab === 'logs'}
                        onClick={() => setActiveTab('logs')}
                    />
                    <NavItem
                        icon={LineChart}
                        label="Charts"
                        active={activeTab === 'charts'}
                        onClick={() => setActiveTab('charts')}
                    />
                    <NavItem
                        icon={User}
                        label="Profile"
                        active={activeTab === 'profile'}
                        onClick={() => setActiveTab('profile')}
                    />
                </nav>
            </div>
        </div>
    );
};

export default App;
