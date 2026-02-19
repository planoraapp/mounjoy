/**
 * AssistantService
 * Base inteligente para o assistente contextual do Mounjoy.
 * Preparado para receber contexto clínico do usuário.
 */
export const getAssistantContext = (user) => {
    const today = new Date().toISOString().split('T')[0];
    const dailyIntake = user.dailyIntakeHistory[today] || { water: 0, protein: 0 };

    return {
        userName: user.name,
        week: calculateWeek(user.startDate),
        medication: user.medicationId,
        currentDose: user.currentDose,
        recentWeight: user.currentWeight,
        dailyIntake,
        hasSideEffects: user.sideEffectsLogs.some(log => isRecent(log.date)),
        isMaintenance: user.isMaintenance
    };
};

const calculateWeek = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now - start) / (1000 * 60 * 60 * 24)) || 1;
    return Math.ceil(diffDays / 7);
};

const isRecent = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    return (now - date) < (1000 * 60 * 60 * 24); // 24h
};
