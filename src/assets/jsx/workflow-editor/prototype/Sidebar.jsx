import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';

import './css/sidebar.css';
import DownloadButton from "./DownloadButton";

export default (props) => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const onSave = (event) => {
        event.preventDefault();
        document.dispatchEvent(new Event('pwe_workflow_save'));
    }

    const onRestore = (event) => {
        event.preventDefault();
        document.dispatchEvent(new Event('pwe_workflow_restore'));
    }

    const onUndo = (event) => {
        event.preventDefault();
        event.stopPropagation();
        document.dispatchEvent(new Event('pwe_workflow_undo'));
    }

    const onRedo = (event) => {
        event.preventDefault();
        event.stopPropagation();
        document.dispatchEvent(new Event('pwe_workflow_redo'));
    }

    return (
        <aside className="uk-background-muted uk-width-1-3@m">
            {Object.keys(props.nodeTypes).map((nodeType) => {
                const params = props.nodeTypes[nodeType];
                return <div key={'sidebar-nodes-' + nodeType}
                            className={'dndnode ' + nodeType + ' pwe-bg-' + params.color}
                            onDragStart={(event) => onDragStart(event, nodeType)} draggable>
                    <FontAwesomeIcon icon={fas[params.icon]}/>&nbsp;{params.label}
                </div>
            })}

            <div className="save__controls">
                <button className="uk-button uk-button-default" onClick={onSave}>
                    <FontAwesomeIcon icon={fas.faSave}/> Save
                </button>
                <button className="uk-button uk-button-default" onClick={onRestore}>
                    <FontAwesomeIcon icon={fas.faRefresh}/> Restore
                </button>
                <br/>
                <button className="uk-button uk-button-default" onClick={onUndo}>
                    <FontAwesomeIcon icon={fas.faUndo}/> Undo
                </button>
                <button className="uk-button uk-button-default" onClick={onRedo}>
                    <FontAwesomeIcon icon={fas.faRedo}/> Redo
                </button>
                <DownloadButton></DownloadButton>
            </div>
        </aside>
    );
};
