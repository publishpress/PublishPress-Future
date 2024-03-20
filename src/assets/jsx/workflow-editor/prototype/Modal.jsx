const {useEffect, useRef} = wp.element;

export default Modal;

function Modal(props) {
    const modalRef = useRef(null);

    const nodeMetabox =
        props.node ?
            <div>{props.node.data.getMetaboxCallback ? props.node.data.getMetaboxCallback(props.node, modalRef.current)
                : ''}</div> : '';

    useEffect(() => {
        console.log(props)
    }, []);

    return (
        <>
            {props.node &&
                <div ref={modalRef} className={"uk-flex-top"}>
                    <div>
                        <div className="uk-modal-header">
                            <h2 className="uk-modal-title">{props.node.data.label}</h2>
                        </div>

                        <div className="uk-modal-body">
                            {nodeMetabox}
                        </div>

                        <button className="uk-button uk-button-primary" onClick={(e) => {
                            e.preventDefault();

                            props.onClose(props.node.id)
                        }}>OK
                        </button>
                    </div>
                </div>
            }
        </>
    );
}
