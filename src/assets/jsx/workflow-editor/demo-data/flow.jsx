export const flowCategories = [
    {
        slug: 'conditional',
        title: 'Conditional',
        icon: 'document',
    },
    {
        slug: 'loop',
        title: 'Loop',
        icon: 'document',
    }
];

export const flowNodes = [
    {
        id: '1',
        type: 'flow',
        name: 'core/if-else',
        title: 'If/Else',
        initialAttributes: {},
        category: 'conditional',
        keywords: ['if', 'else'],
        disabled: false,
        isDisabled: false,
        frecency: 5,
        icon: {
            src: 'document',
            background: '#ffffff',
            foreground: '#1e1e1e',
        },
    },
    {
        id: '2',
        type: 'flow',
        name: 'core/switch-case',
        title: 'Switch/Case',
        initialAttributes: {},
        category: 'conditional',
        keywords: ['switch', 'case'],
        disabled: false,
        isDisabled: false,
        frecency: 3,
        icon: {
            src: 'document',
            background: '#ffffff',
            foreground: '#1e1e1e',
        },
    },
    {
        id: '3',
        type: 'flow',
        name: 'core/for-each',
        title: 'For Each',
        initialAttributes: {},
        category: 'loop',
        keywords: ['for', 'each'],
        disabled: false,
        isDisabled: false,
        frecency: 1,
        icon: {
            src: 'document',
            background: '#ffffff',
            foreground: '#1e1e1e',
        },
    },
];
