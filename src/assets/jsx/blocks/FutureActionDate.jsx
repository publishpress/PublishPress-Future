import { Fragment } from "react";

const storeName = 'publishpress-future/future-action';

export const FutureActionDate = {
    apiVersion: 3,
    title: 'Future Action Date',
    icon: 'clock',
    category: 'text',
    attributes: {
        template: {
            type: 'string',
            default: 'Post expires at #ACTIONTIME on #ACTIONDATE.',
        },
        alignment: {
            type: 'string',
            default: 'none',
        },
    },
    example: {
        attributes: {
            template: 'Post expires at #ACTIONTIME on #ACTIONDATE.',
            alignment: 'none',
        },
    },
    edit: ({ attributes, setAttributes, isSelected }) => {
        const { useSelect } = wp.data;
        const {
            RichText,
            useBlockProps,
            BlockControls,
            AlignmentToolbar,
        } = wp.blockEditor;

        const { date, enabled } = useSelect((select) => {
            const store = select(storeName);

            return {
                date: store ? store.getDate() : '',
                enabled: store ? store.getEnabled() : false,
            }
        });

        const onChangeTemplate = (value) => {
            setAttributes({ template: value });
        }

        const onChangeAligmment = (value) => {
            setAttributes({ alignment: value });
        }

        return (
            <div { ...useBlockProps() }>
                {isSelected &&
                    <Fragment>
                        {
                            <BlockControls>
                                <AlignmentToolbar
                                    value={attributes.alignment}
                                    onChange={onChangeAligmment}
                                />
                            </BlockControls>
                        }
                        <RichText
                            tagName="div"
                            value={attributes.template}
                            onChange={onChangeTemplate}
                            style={ { textAlign: attributes.alignment } }
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
                    </Fragment>
                }

                {! isSelected &&
                    <RichText.Content
                        tagName="div"
                        value={attributes.template}
                        style={ { textAlign: attributes.alignment } }
                        className={'future-action-block'}
                    />
                }
            </div>
        );
    },
}
