/**
 * WordPress dependencies
 */
// import NodeIcon from './node-icon';

function InserterPanel({ title, icon, children }) {
    return (
        <>
            <div className="block-editor-inserter__panel-header">
                <h2 className="block-editor-inserter__panel-title">
                    {title}
                </h2>
                {/* <NodeIcon icon={icon} /> */}
            </div>
            <div className="block-editor-inserter__panel-content">
                {children}
            </div>
        </>
    );
}

export default InserterPanel;
