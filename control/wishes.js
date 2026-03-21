/**
 * Luminary Wishes - Template Definitions
 * Only applicable for Paid Plans (Lumidomain & Pro)
 */

const WISHES_CONFIG = {
    templates: [
        {
            id: 'birthday',
            name: 'Birthday Bash',
            description: 'Confetti, balloons & fun',
            icon: '🎂',
            tags: ['Balloons', 'Cake'],
            gradient: 'var(--primary-gradient)'
        },
        {
            id: 'anniversary',
            name: 'Anniversary',
            description: 'Romantic timeline & love',
            icon: '💑',
            tags: ['Hearts', 'Elegant'],
            gradient: 'var(--secondary-gradient)'
        },
        {
            id: 'marriage',
            name: 'Wedding Day',
            description: 'Elegant, floral & pure',
            icon: '💒',
            tags: ['Floral', 'Rings'],
            gradient: 'var(--accent-gradient)'
        },
        {
            id: 'custom',
            name: 'Custom Theme',
            description: 'Diwali, Christmas, etc.',
            icon: '✨',
            tags: ['Your Choice', 'Unique'],
            gradient: 'var(--gold-gradient)'
        }
    ]
};

// Make it globally available
window.WISHES_CONFIG = WISHES_CONFIG;
