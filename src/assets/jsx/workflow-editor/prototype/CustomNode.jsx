import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {fas, faPencil} from '@fortawesome/free-solid-svg-icons';


export default CustomNode;

function CustomNode(props) {
    if (! props.data.color) {
        props.data.color = 'blue-lighten-5';
    }

    const nodeClassName = props.isTrigger ? 'pwe-step-node pwe-trigger-node' : 'pwe-step-node';

    const onClickEditButton = (event) => {
        event.preventDefault();

        props.data.editCallback(props);
    }

    const onClickNode = (event) => {
        event.preventDefault();

        // Is a double click?
        if (event.detail > 1) {
            onClickEditButton(event)
        }
    }

    return (
        <div className={nodeClassName + " uk-box-shadow-medium pwe-bg-" + props.data.color} onClick={onClickNode}>
            <div className={'pwe-node-title-bar uk-flex uk-flex-inline'}>
                <div className={'pwe-icon uk-flex-left'}>
                    <FontAwesomeIcon icon={fas[props.data.icon]}/>
                </div>
                <div className="pwe-node-title uk-flex-right@l">
                    <div className="pwe-label">{props.data.label}</div>
                </div>
            </div>

            {(props.selected && props.data.hasParams) &&
                <div className={'pwe-node-edit-button'} onClick={onClickEditButton}><FontAwesomeIcon icon={faPencil}/></div>
            }

            {props.handlers}

            {props.children &&
                <div className="pwe-node-metadata">{props.children}</div>
            }
        </div>
    );
}
