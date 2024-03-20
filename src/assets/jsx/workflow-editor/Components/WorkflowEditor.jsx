import ReactFlow, { ReactFlowProvider } from 'reactflow';

export function WorkflowEditor() {
    const nodes = [
        {
            id: '1',
            type: 'input',
            data: { label: 'Input Node' },
            position: { x: 250, y: 5 }
        },
        {
            id: '2',
            data: { label: 'Another Node' },
            position: { x: 100, y: 100 }
        }
    ];

    const edges = [
        { id: 'e1-2', source: '1', target: '2' }
    ];

    return (
        <div className="future-workflow-editor">
            <ReactFlow nodes={nodes} edges={edges}/>
        </div>
    );
}
