const storeName = 'publishpress-future/future-action';

const BlockEdit = (props) => {
    const { useEffect, Fragment } = wp.element;
    const { useSelect } = wp.data;
    const { attributes, setAttributes, isSelected } = props;
    const { RichText, useBlockProps } = wp.blockEditor;

    const { date, enabled } = useSelect((select) => {
        const store = select(storeName);

        return {
            date: store ? store.getDate() : '',
            enabled: store ? store.getEnabled() : false,
        }
    });

    return (
        <div { ...useBlockProps() }>
            {isSelected &&
                <RichText
                    tagName="div"
                    value={attributes.template}
                    onChange={(value) => setAttributes({ template: value })}
                    placeholder="Future action block template. Type the text and # to see the autocomplete options."
                    className="future-action-block"
                    autocompleters={[
                        {
                            name: 'future-action-placeholders',
                            triggerPrefix: '#',
                            options: [
                                {
                                    value: '#ACTIONTIME',
                                    label: 'Action time',
                                },
                                {
                                    value: '#ACTIONDATE',
                                    label: 'Action date',
                                },
                                {
                                    value: '#ACTIONDATETIME',
                                    label: 'Action date and time',
                                },
                            ],
                            getOptionLabel: (option) => option.label,
                            getOptionKeywords: (option) => [option.value],
                            getOptionCompletion: (option) => option.value,
                        },
                    ]}
                />
            }

            {! isSelected &&
                <RichText.Content
                    tagName="div"
                    value={attributes.template}
                    className="future-action-block"
                />
            }
        </div>
    );
};

export const FutureActionDate = {
    apiVersion: 2,
    title: 'Future Action Date',
    icon: 'clock',
    category: 'text',
    attributes: {
        template: {
            type: 'string',
            default: 'Post expires at #ACTIONTIME on #ACTIONDATE',
        },
    },
    edit: BlockEdit,
    save: () => null,
}
