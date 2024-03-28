import { MarkerType } from 'reactflow';

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
