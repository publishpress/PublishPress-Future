import NodeIcon from "../node-icon";
import { NodeCard } from "./node-card";

export function InserterPreviewPanel({item}) {
    return (
        <div className="block-editor-inserter__preview-container">
            <NodeCard node={item} />
        </div>
    );
}

export default InserterPreviewPanel;
