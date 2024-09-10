import ELK from "elkjs";
import { AUTO_LAYOUT_DIRECTION_DOWN, AUTO_LAYOUT_DIRECTION_RIGHT } from "./constants";

export const useLayoutedElements = ({
    nodes,
    edges,
    onLayout,
    onAnimationFrame = () => null
}) => {
    return ({ direction }) => {
        // Elk has a *huge* amount of options to configure. To see everything you can
        // tweak check out:
        //
        // - https://www.eclipse.org/elk/reference/algorithms.html
        // - https://www.eclipse.org/elk/reference/options.html
        const opts = {
            'elk.direction': direction,
            'elk.algorithm': 'layered',
            'elk.layered.spacing.nodeNodeBetweenLayers': '70', // Vertical spacing between nodes/layers
            'elk.spacing.nodeNode': '70', // Horizontal spacing between nodes
        };

        const getLayoutedElements = async (nodes, edges, options = {}) => {
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

            const elk = new ELK();

            try {
                const layoutedGraph = await elk
                    .layout(graph);
                return ({
                    nodes: layoutedGraph.children.map((node_1) => ({
                        ...node_1,
                        // React Flow expects a position property on the node instead of `x`
                        // and `y` fields.
                        position: { x: node_1.x, y: node_1.y },
                    })),

                    edges: layoutedGraph.edges,
                });
            } catch (message) {
                return console.error(message);
            }
        };

        getLayoutedElements(nodes, edges, opts).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
            onLayout(layoutedNodes, layoutedEdges);

            window.requestAnimationFrame(() => onAnimationFrame());
        });
    }
}

export default useLayoutedElements;
