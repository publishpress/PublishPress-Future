import NodeIcon from "../node-icon";

export function NodeCard({node}) {
    return (
        <div className="block-editor-block-card">
            <NodeIcon icon={node.icon} showColors className={'block-editor-block-icon'} />
            <div className="block-editor-block-card__content">
                <h2 className="block-editor-block-card__title">{ node.label }</h2>
                { node.description && (
                    <span className="block-editor-block-card__description">
                        { node.description }
                    </span>
                ) }
            </div>
        </div>
    )
}
