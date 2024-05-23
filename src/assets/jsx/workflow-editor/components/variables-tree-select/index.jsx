import { TreeSelect } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

export function VariablesTreeSelect({ label, selectedId, onChange, tree }) {
    return (
        <TreeSelect
            label={label}
            tree={tree}
            selectedId={selectedId}
            onChange={onChange}
        />
    );
}

export default VariablesTreeSelect;
