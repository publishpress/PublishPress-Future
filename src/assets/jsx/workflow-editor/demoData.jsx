import { MarkerType } from 'reactflow';

const nodeStyle = {
    color: '#0041d0',
    borderColor: '#0041d0',
};

export const nodes = [
    {
        type: 'input',
        id: '1',
        data: { label: 'Thanks' },
        position: { x: 100, y: 0 },
        style: nodeStyle,
    },
    {
        id: '2',
        data: { label: 'for' },
        position: { x: 0, y: 100 },
        style: nodeStyle,
    },
    {
        id: '3',
        data: { label: 'using' },
        position: { x: 200, y: 100 },
        style: nodeStyle,
    },
    {
        id: '4',
        data: { label: 'PublishPress Future Pro!' },
        position: { x: 100, y: 200 },
        style: nodeStyle,
    },
];

export const edges = [
    {
        id: '1->2',
        source: '1',
        target: '2',
        animated: false,
        markerEnd: {
            type: MarkerType.ArrowClosed,
        },
        style: {
            strokeWidth: 2,
        },
    },
    {
        id: '1->3',
        source: '1',
        target: '3',
        animated: false,
        markerEnd: {
            type: MarkerType.ArrowClosed,
        },
        style: {
            strokeWidth: 2,
        },
    },
    {
        id: '2->4',
        source: '2',
        target: '4',
        animated: false,
        markerEnd: {
            type: MarkerType.ArrowClosed,
        },
        style: {
            strokeWidth: 2,
        },
    },
    {
        id: '3->4',
        source: '3',
        target: '4',
        animated: false,
        markerEnd: {
            type: MarkerType.ArrowClosed,
        },
        style: {
            strokeWidth: 2,
        },
    },
];

export const triggerCategories = [
    {
        slug: 'core',
        title: 'Core',
        icon: 'wordpress',
    },
];

export const triggerNodes = [
    {
        id: '1',
        name: 'core/trigger-1',
        title: 'Trigger 1',
        initialAttributes: {},
        category: 'core',
        disabled: false,
        isDisabled: false,
        frecency: 1,
        icon: {
            src: 'wordpress',
            background: '#ffffff',
            foreground: '#676767',
        },
    },
    {
        id: '2',
        name: 'core/trigger-2',
        title: 'Trigger 2',
        initialAttributes: {},
        category: 'core',
        disabled: false,
        isDisabled: false,
        frecency: 3,
        icon: {
            src: 'wordpress',
            background: '#ffffff',
            foreground: '#676767',
        },
    },
    {
        id: '3',
        name: 'core/trigger-3',
        title: 'Trigger 3',
        initialAttributes: {},
        category: 'core',
        disabled: false,
        isDisabled: false,
        frecency: 1,
        icon: {
            src: 'wordpress',
            background: '#ffffff',
            foreground: '#676767',
        },
    },
];
