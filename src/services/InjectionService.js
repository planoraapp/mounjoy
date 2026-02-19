/**
 * InjectionService
 * Gerencia a lógica de rotação de locais de aplicação e sugestões inteligentes.
 */

export const SITES = [
    { id: 'abdomen-left', area: 'Abdômen', side: 'Esquerdo', label: 'Abdômen (E)', icon: '📍' },
    { id: 'abdomen-right', area: 'Abdômen', side: 'Direito', label: 'Abdômen (D)', icon: '📍' },
    { id: 'thigh-left', area: 'Coxa', side: 'Esquerdo', label: 'Coxa (E)', icon: '🦵' },
    { id: 'thigh-right', area: 'Coxa', side: 'Direito', label: 'Coxa (D)', icon: '🦵' },
    { id: 'arm-left', area: 'Braço', side: 'Esquerdo', label: 'Braço (E)', icon: '💪' },
    { id: 'arm-right', area: 'Braço', side: 'Direito', label: 'Braço (D)', icon: '💪' },
];

/**
 * Sugere o próximo local de aplicação baseado no histórico.
 * Regra: Não repetir o mesmo local nas últimas 3 aplicações.
 * Prioridade: Abdômen -> Coxa -> Braço.
 */
export const suggestNextInjection = (history = []) => {
    if (!history || history.length === 0) {
        return SITES[0]; // Default: Abdômen Esquerdo
    }

    const recentIds = history.slice(0, 3).map(i => i.siteId);

    // Filtrar opções disponíveis (não usadas recentemente)
    const available = SITES.filter(s => !recentIds.includes(s.id));

    if (available.length > 0) {
        // Priorizar Abdômen, depois alternar
        const abdomenOptions = available.filter(s => s.area === 'Abdômen');
        if (abdomenOptions.length > 0) return abdomenOptions[0];

        const thighOptions = available.filter(s => s.area === 'Coxa');
        if (thighOptions.length > 0) return thighOptions[0];

        return available[0];
    }

    // Fallback: Pegar o menos recentemente usado (o último da lista de histórico que aparece)
    const lastUsed = history[history.length - 1];
    return SITES.find(s => s.id !== lastUsed.siteId) || SITES[0];
};

export const getSiteById = (id) => SITES.find(s => s.id === id) || SITES[0];
