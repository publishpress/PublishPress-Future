export const triggerCategories = [
    {
        slug: 'schedulling',
        title: 'Scheduled Date & Time',
        icon: {
            src: 'calendar',
        }
    },
    {
        slug: 'post',
        title: 'Post',
        icon: {
            src: 'document',
        }
    },
    {
        slug: 'user',
        title: 'User',
        icon: {
            src: 'users',
        }
    },
    {
        slug: 'woocommerce',
        title: 'WooCommerce',
        icon: {
            src: 'woo'
        }
    }
];

export const triggerNodes = [
    {
        id: '1',
        type: 'trigger',
        name: 'core/scheduling',
        title: 'Scheduled date & time',
        initialAttributes: {},
        category: 'schedulling',
        disabled: false,
        isDisabled: false,
        frecency: 1,
        icon: {
            src: 'calendar',
            background: '#ffffff',
            foreground: '#1e1e1e',
        },
    },
    {
        id: '2',
        type: 'trigger',
        name: 'core/save-post',
        title: 'Post is saved',
        initialAttributes: {},
        category: 'post',
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
        id: '5',
        type: 'trigger',
        name: 'core/publish-post',
        title: 'Post is published',
        initialAttributes: {},
        category: 'post',
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
        type: 'trigger',
        name: 'core/create-user',
        title: 'User is created',
        initialAttributes: {},
        category: 'user',
        disabled: false,
        isDisabled: false,
        frecency: 1,
        icon: {
            src: 'users',
            background: '#ffffff',
            foreground: '#1e1e1e',
        },
    },
    {
        id: '4',
        type: 'trigger',
        name: 'woocommerce/order-created',
        title: 'Order is created',
        initialAttributes: {},
        category: 'woocommerce',
        disabled: false,
        isDisabled: false,
        frecency: 1,
        icon: {
            src: 'woo',
            background: '#ffffff',
            foreground: '#1e1e1e',
        },
    }
];
