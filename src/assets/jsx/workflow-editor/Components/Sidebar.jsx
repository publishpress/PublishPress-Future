import { useNodes } from 'reactflow';

export function Sidebar() {
    const nodes = useNodes();

    return (
        <aside>
            {nodes.map((node) => (
                <div key={node.id}>
                Node {node.id} -
                    x: {node.position.x.toFixed(2)},
                    y: {node.position.y.toFixed(2)}
                </div>
            ))}
        </aside>
    );
}
