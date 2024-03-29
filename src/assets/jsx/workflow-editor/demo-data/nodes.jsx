import { nodeStyle } from '../default-nodes-props';

export const nodes = [
    {
        type: 'input',
        id: '1',
        data: { label: 'Post is published' },
        position: { x: 100, y: 0 },
        style: nodeStyle['trigger'],
    },
    {
        id: '2',
        data: { label: 'Update post' },
        position: { x: 0, y: 100 },
        style: nodeStyle['action'],
    },
    {
        id: '3',
        data: { label: 'Update post meta' },
        position: { x: 200, y: 100 },
        style: nodeStyle['action'],
    },
    {
        id: '4',
        data: { label: 'Send email' },
        position: { x: 100, y: 200 },
        style: nodeStyle['action'],
    },
];
