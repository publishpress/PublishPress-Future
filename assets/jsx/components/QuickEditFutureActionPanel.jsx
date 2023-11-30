import FutureActionPanel from './FutureActionPanel';

const QuickEditFutureActionPanel = (props) => {
    const { useSelect } = wp.data;

    const onChangeData = (attribute, value) => {};

    const date = useSelect((select) => select(props.storeName).getDate(), []);
    const enabled = useSelect((select) => select(props.storeName).getEnabled(), []);
    const action = useSelect((select) => select(props.storeName).getAction(), []);
    const terms = useSelect((select) => select(props.storeName).getTerms(), []);
    const taxonomy = useSelect((select) => select(props.storeName).getTaxonomy(), []);

    let termsString = terms;
    if (typeof terms === 'object') {
        termsString = terms.join(',');
    }

    return (
        <div className={'post-expirator-panel'}>
            <FutureActionPanel
                postType={props.postType}
                isCleanNewPost={props.isNewPost}
                actionsSelectOptions={props.actionsSelectOptions}
                enabled={enabled}
                action={action}
                date={date}
                terms={terms}
                taxonomy={taxonomy}
                onChangeData={onChangeData}
                is12hours={props.is12hours}
                startOfWeek={props.startOfWeek}
                storeName={props.storeName}
                strings={props.strings} />

            {/* Quick edit JS code will save only fields with name inside the edit row */}
            <input type="hidden" name={'future_action_enabled'} value={enabled ? 1 : 0} />
            <input type="hidden" name={'future_action_action'} value={action} />
            <input type="hidden" name={'future_action_date'} value={date} />
            <input type="hidden" name={'future_action_terms'} value={termsString} />
            <input type="hidden" name={'future_action_taxonomy'} value={taxonomy} />
            <input type="hidden" name={'future_action_view'} value="quick-edit" />
            <input type="hidden" name={'_future_action_nonce'} value={props.nonce} />
        </div>
    );
};

export default QuickEditFutureActionPanel;
