import { Fragment } from "react";

const storeName = 'publishpress-future/future-action';

export const FutureActionDate = {
    apiVersion: 3,
    title: 'Future Action Date',
    icon: 'clock',
    description: 'Displays a message with the date and time of the future action.',
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
        bgColor: {
            type: 'string',
            default: 'none'
        },
        textColor: {
            type: 'string',
            default: '#000000'
        },
    },
    example: {
        attributes: {
            template: 'Post expires at #ACTIONTIME on #ACTIONDATE.',
            alignment: 'none',
            bgColor: 'none',
            textColor: '#000000',
        },
    },
    edit: ({ attributes, setAttributes, isSelected }) => {
        const { useSelect } = wp.data;
        const {
            RichText,
            useBlockProps,
            BlockControls,
            AlignmentToolbar,
            ColorPalette,
            InspectorControls,
        } = wp.blockEditor;
        const { __ } = wp.i18n;
        const {
            __experimentalToolsPanel,
            __experimentalToolsPanelDescription,
        } = wp.components;

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

        const onChangeBgColor = (value) => {
            setAttributes({ bgColor: value });
        }

        const onChangeTextColor = (value) => {
            setAttributes({ textColor: value });
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
                        {
                            <InspectorControls key="help">
                                <__experimentalToolsPanel
                                    label="Help"
                                    >
                                        <div className="future-action-tools-panel-help">
                                            Type the action block template and use # to use the autocomplete options with the available placeholders.

                                            <h2>Available placeholders</h2>
                                            <ul>
                                                <li>#ACTIONDATE</li>
                                                <li>#ACTIONTIME</li>
                                                <li>#ACTIONDATETIME</li>
                                            </ul>
                                        </div>
                                </__experimentalToolsPanel>
                            </InspectorControls>
                        }
                        <RichText
                            tagName="div"
                            value={attributes.template}
                            onChange={onChangeTemplate}
                            style={ {
                                textAlign: attributes.alignment,
                                backgroundColor: attributes.bgColor,
                                color: attributes.textColor,
                            } }
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
                        style={ {
                            textAlign: attributes.alignment,
                            backgroundColor: attributes.bgColor,
                            color: attributes.textColor,
                        } }
                        className={'future-action-block'}
                    />
                }
            </div>
        );
    },
}
