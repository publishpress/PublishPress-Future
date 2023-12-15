import { FutureActionPanel } from './';

export const FutureActionPanelBlockEditor = (props) => {
    const { PluginDocumentSettingPanel } = wp.editPost;
    const { useDispatch, select } = wp.data;

    const { editPost } = useDispatch('core/editor');

    const editPostAttribute = (newAttribute) => {
        const attribute = {
            publishpress_future_action: {}
        };

        // For each property on newAttribute, set the value on attribute
        for (const [name, value] of Object.entries(newAttribute)) {
            attribute.publishpress_future_action[name] = value;
        }

        editPost(attribute);
    }

    const onChangeData = (attribute, value) => {
        const store = select(props.storeName);

        const newAttribute = {
            'enabled': store.getEnabled()
        }

        if (newAttribute.enabled) {
            newAttribute['action'] = store.getAction();
            newAttribute['date'] = store.getDate();
            newAttribute['terms'] = store.getTerms();
            newAttribute['taxonomy'] = store.getTaxonomy();
        }

        editPostAttribute(newAttribute);
    }

    const data = select('core/editor').getEditedPostAttribute('publishpress_future_action');

    return (
        <PluginDocumentSettingPanel
            name={'publishpress-future-action-panel'}
            title={props.strings.panelTitle}
            icon="calendar"
            initialOpen={props.postTypeDefaultConfig.autoEnable}
            className={'post-expirator-panel'}>
            <div id='publishpress-future-block-editor'>
                <FutureActionPanel
                    context={'block-editor'}
                    postType={props.postType}
                    isCleanNewPost={props.isCleanNewPost}
                    actionsSelectOptions={props.actionsSelectOptions}
                    enabled={data.enabled}
                    calendarIsVisible={true}
                    action={data.action}
                    date={data.date}
                    terms={data.terms}
                    taxonomy={data.taxonomy}
                    taxonomyName={props.taxonomyName}
                    onChangeData={onChangeData}
                    is12Hour={props.is12Hour}
                    timeFormat={props.timeFormat}
                    startOfWeek={props.startOfWeek}
                    storeName={props.storeName}
                    strings={props.strings} />
            </div>
        </PluginDocumentSettingPanel>
    );
};
