const storeName = 'publishpress-future/future-action';

const BlockEdit = (props) => {
    const { useEffect } = wp.element;
    const { useSelect } = wp.data;
    const { attributes, setAttributes } = props;
    const { RichText } = wp.blockEditor;

    const { date, enabled } = useSelect((select) => {
        return {
            date: select(storeName).getDate(),
            enabled: select(storeName).getEnabled(),
        }
    });

    useEffect(() => {
        setAttributes({ date, enabled });
    }, [date, enabled]);

    return (
        <RichText
            tagName="p"
            value={attributes.template}
            onChange={(value) => {setAttributes({ template: value }); console.log(value);)}}
            placeholder="Enter the template for the future action date block"
            className="future-action-date"
            autocompleters={[
                {
                    name: 'future-action-date',
                    triggerPrefix: 'ACTION',
                    options: [
                        {
                            value: 'TIME',
                            label: 'TIME',
                        },
                        {
                            value: 'DATE',
                            label: 'DATE',
                        },
                    ],
                },
            ]}
        />
    );
};

export const FutureActionDateBlock = {
    title: 'Future Action Date',
    icon: 'clock',
    category: 'common',
    attributes: {
        enabled: {
            type: 'boolean',
            default: false,
        },
        date: {
            type: 'string',
            default: '',
        },
        template: {
            type: 'string',
            default: 'Post expires at ACTIONTIME on ACTIONDATE',
        },
    },
    edit: BlockEdit,
    save: () => null,
};
