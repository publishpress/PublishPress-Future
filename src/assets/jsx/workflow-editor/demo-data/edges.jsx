import { defaultEdgeProps } from '../default-edges-props';

export const edges = [
    {
        id: '1->2',
        source: '1',
        target: '2',
        ...defaultEdgeProps,
    },
    {
        id: '1->3',
        source: '1',
        target: '3',
        ...defaultEdgeProps,
    },
    {
        id: '2->4',
        source: '2',
        target: '4',
        ...defaultEdgeProps,
    },
    {
        id: '3->4',
        source: '3',
        target: '4',
        ...defaultEdgeProps,
    },
];
