import { __ } from "@wordpress/i18n";
import BaseField from "./base-field";
import { SelectControl } from "@wordpress/components";

export function DateOffset({ field, settings, onChange }) {
    return (
        <BaseField description={field.description}>
            <SelectControl
                label={__("Base date", "publishpress-future-pro")}
                options={[
                    { label: "Input post", value: "days" },
                    { label: "Event date", value: "weeks" },
                    { label: "Specific date", value: "weeks" },
                ]}
            />
            <div>the date offset</div>
        </BaseField>
    );
}

export default DateOffset;
