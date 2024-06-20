import { SelectControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";
import { __experimentalVStack as VStack } from "@wordpress/components";
import InlineMultiSelect from "../inline-multi-select";
import { store as workflowStore } from "../workflow-store";
import { useSelect, useDispatch } from "@wordpress/data";
import { RadioControl } from "@wordpress/components";


export function TaxonomyTerms({ name, label, defaultValue, onChange, settings }) {
    const taxonomies = futureWorkflowEditor.taxonomies;

    const defaultTaxonomy = defaultValue?.taxonomy || taxonomies[0]?.value;

    const {
        taxonmoyTerms,
    } = useSelect((select) => {
        const {
            getTaxonomyTerms,
        } = select(workflowStore);

        return {
            taxonmoyTerms: getTaxonomyTerms(defaultTaxonomy),
        };
    });

    const {
        fetchTaxonomyTerms,
    } = useDispatch(workflowStore)

    const optionToSelectAll = settings && settings?.optionToSelectAll === true;
    const labelOptionToSelectAll = settings && settings?.labelOptionToSelectAll;

    const onChangeSetting = ({ settingName, value }) => {
        const newValue = { ...defaultValue };
        newValue[settingName] = value;

        if (onChange) {
            onChange(name, newValue);
        }
    }

    // Set default setting
    useEffect(() => {
        if (!defaultValue) {
            defaultValue = {
                taxonomy: defaultTaxonomy,
                terms: [],
            };

            onChangeSetting({ settingName: "taxonomy", value: defaultTaxonomy });
        }
    }, []);

    useEffect(() => {
        fetchTaxonomyTerms(defaultTaxonomy);
    }, [defaultTaxonomy]);

    return (
        <>
            <VStack>
                <SelectControl
                    label={__("Taxonomy", "publishpress-future-pro")}
                    value={defaultValue?.taxonomy}
                    options={taxonomies}
                    onChange={(value) => onChangeSetting({ settingName: "taxonomy", value })}
                />

                {optionToSelectAll && (
                    <>
                        <RadioControl
                            label={__("Select the terms", "publishpress-future-pro")}
                            selected={defaultValue?.selectAll || '0'}
                            options={[
                                { label: labelOptionToSelectAll, value: '1' },
                                { label: __("Specific terms", "publishpress-future-pro"), value: '0' }
                            ]}
                            onChange={(value) => onChangeSetting({ settingName: "selectAll", value })}
                        />

                        {defaultValue?.selectAll !== '1' && (
                            <InlineMultiSelect
                                label={__('Terms', 'publishpress-future-pro')}
                                value={defaultValue?.terms || []}
                                suggestions={taxonmoyTerms}
                                expandOnFocus={true}
                                autoSelectFirstMatch={true}
                                onChange={(value) => onChangeSetting({ settingName: "terms", value })}
                            />
                        )}
                    </>
                )}

                {!optionToSelectAll && (
                    <InlineMultiSelect
                        label={__('Terms', 'publishpress-future-pro')}
                        value={defaultValue?.terms || []}
                        suggestions={taxonmoyTerms}
                        expandOnFocus={true}
                        autoSelectFirstMatch={true}
                        onChange={(value) => onChangeSetting({ settingName: "terms", value })}
                    />
                )}
            </VStack>
        </>
    );
}

export default TaxonomyTerms;
