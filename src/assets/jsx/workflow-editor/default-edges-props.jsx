import { MarkerType } from 'reactflow';

export const defaultEdgeProps = {
    animated: false,
    markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 10
    },
    style: {
        strokeWidth: 2,
    }
};
