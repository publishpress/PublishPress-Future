import ELK from "elkjs";
import { AUTO_LAYOUT_DIRECTION_DOWN, AUTO_LAYOUT_DIRECTION_RIGHT } from "../constants";

const elk = new ELK();

// Elk has a *huge* amount of options to configure. To see everything you can
// tweak check out:
//
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html
const elkOptions = {
    'elk.algorithm': 'layered',
    'elk.layered.spacing.nodeNodeBetweenLayers': '60',
    'elk.spacing.nodeNode': '40',
};

const getLayoutedElements = (nodes, edges, options = {}) => {
    const isHorizontal = options?.['elk.direction'] === AUTO_LAYOUT_DIRECTION_RIGHT;

    const graph = {
        id: 'root',
        layoutOptions: options,
        children: nodes.map((node) => ({
            ...node,
            // Adjust the target and source handle positions based on the layout
            // direction.
            targetPosition: isHorizontal ? 'left' : 'top',
            sourcePosition: isHorizontal ? 'right' : 'bottom',

            // Hardcode a width and height for elk to use when layouting.
            width: 150,
            height: 50,
        })),
        edges: edges,
    };

    return elk
        .layout(graph)
        .then((layoutedGraph) => ({
            nodes: layoutedGraph.children.map((node) => ({
                ...node,
                // React Flow expects a position property on the node instead of `x`
                // and `y` fields.
                position: { x: node.x, y: node.y },
            })),

            edges: layoutedGraph.edges,
        }))
        .catch(console.error);
};

export const useLayoutedElements = ({
    nodes,
    edges,
    onLayout,
    onAnimationFrame = () => null
}) => {
    return ({ direction }) => {
        const opts = { 'elk.direction': direction, ...elkOptions };

        getLayoutedElements(nodes, edges, opts).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
            onLayout(layoutedNodes, layoutedEdges);

            window.requestAnimationFrame(() => onAnimationFrame());
        });
    }
}
