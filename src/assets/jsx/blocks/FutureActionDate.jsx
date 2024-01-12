import { Fragment } from "react";

const storeName = 'publishpress-future/future-action';

export const FutureActionDate = {
    apiVersion: 3,
    title: publishpressFutureProBlocks.text.blockTitle,
    icon: 'clock',
    description: publishpressFutureProBlocks.text.blockDescription,
    category: 'text',
    attributes: {
        template: {
            type: 'string',
            default: publishpressFutureProBlocks.text.defaultTemplate,
        },
        alignment: {
            type: 'string',
            default: 'none',
        },
    },
    example: {
        attributes: {
            template: publishpressFutureProBlocks.text.defaultTemplate,
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
            InspectorControls,
        } = wp.blockEditor;
        const { insert, insertObject } = wp.richText;
        const { __ } = wp.i18n;
        const {
            __experimentalToolsPanel,
            ToolbarDropdownMenu,
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
                                {/* <ToolbarDropdownMenu
                                    icon={'plus'}
                                    label={__('Placeholder', 'publishpress-future')}
                                    controls={[
                                        {
                                            icon: 'calendar',
                                            title: __('Action Date', 'publishpress-future'),
                                            onClick: () => {
                                                insertObject(attributes.template, {
                                                    type: 'text',
                                                    attributes: {
                                                        text: '#ACTIONDATE',
                                                    },
                                                });
                                            },
                                        },
                                        {
                                            icon: 'clock',
                                            title: __('Action Time', 'publishpress-future'),
                                            onClick: () => {
                                                insert(
                                                    attributes.template,
                                                    '#ACTIONTIME'
                                                );
                                            },
                                        },
                                    ]}
                                /> */}
                            </BlockControls>
                        }
                        {
                            <InspectorControls key="help">
                                <__experimentalToolsPanel
                                    label="Help"
                                    >
                                        <div className="future-action-tools-panel-help">
                                            {publishpressFutureProBlocks.text.helpPanelText}

                                            <h2>{publishpressFutureProBlocks.text.availablePlaceholders}</h2>
                                            <ul>
                                                <li>#ACTIONDATE</li>
                                                <li>#ACTIONTIME</li>
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
                            } }
                            placeholder={publishpressFutureProBlocks.text.editorPlaceholder}
                            className="future-action-block"
                            autocompleters={[
                                {
                                    name: 'future-action-placeholders',
                                    triggerPrefix: '#',
                                    options: [
                                        {
                                            value: '#ACTIONTIME',
                                            label: publishpressFutureProBlocks.text.actionTimeLabel,
                                        },
                                        {
                                            value: '#ACTIONDATE',
                                            label: publishpressFutureProBlocks.text.actionDateLabel,
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
                        } }
                        className={'future-action-block'}
                    />
                }
            </div>
        );
    },
    save: () => null
}
