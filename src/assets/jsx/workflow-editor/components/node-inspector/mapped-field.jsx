import PostQuery from "../data-fields/post-query";
import { __, sprintf } from "@wordpress/i18n";
import Recurrence from "../data-fields/recurrence";
import { DateOffset } from "../data-fields/date-offset";
import DebugData from "../data-fields/debug-data";
import RayColor from "../data-fields/ray-color";
import Text from "../data-fields/text";

export const MappedField = (props) => {
    switch (props.type) {
        case "postQuery":
            return (
                <PostQuery {...props} />
            );
        case "dateOffset":
            return (
                <DateOffset {...props} />
            );
        case "recurrence":
            return (
                <Recurrence {...props} />
            );
        case "debugData":
            return (
                <DebugData {...props} />
            );
        case "rayColor":
            return (
                <RayColor {...props} />
            );
        case "text":
            return (
                <Text {...props} />
            );
    }

    return (
        <i>{sprintf(__('Field type %s is not implemented', 'publihspress-future-pro'), props.type)}</i>
    );
}

export default MappedField;
