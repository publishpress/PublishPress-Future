import { nodeStyle } from '../default-nodes-props';

export const nodes = [
    {
        type: 'input',
        id: '1',
        data: { label: 'Post is published' },
        position: { x: 150, y: 0 },
        style: nodeStyle['trigger'],
    },
    {
        id: '2',
        data: { label: 'Update post' },
        position: { x: 0, y: 150 },
        style: nodeStyle['action'],
    },
    {
        id: '3',
        data: { label: 'Update post meta' },
        position: { x: 300, y: 150 },
        style: nodeStyle['action'],
    },
    {
        id: '4',
        data: { label: 'Send email' },
        position: { x: 150, y: 300 },
        style: nodeStyle['action'],
    },
];
