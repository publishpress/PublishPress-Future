import { SelectControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";
import { __experimentalVStack as VStack } from "@wordpress/components";
import InlineMultiSelect from "../inline-multi-select";
import { store as workflowStore } from "../workflow-store";
import { useSelect, useDispatch } from "@wordpress/data";


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

                <InlineMultiSelect
                    label={__('Terms', 'publishpress-future-pro')}
                    value={defaultValue?.terms || []}
                    suggestions={taxonmoyTerms}
                    expandOnFocus={true}
                    autoSelectFirstMatch={true}
                    onChange={(value) => onChangeSetting({ settingName: "terms", value })}
                />
            </VStack>
        </>
    );
}

export default TaxonomyTerms;
