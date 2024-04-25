import PostQuery from "../data-fields/post-query";
import { __, sprintf } from "@wordpress/i18n";
import Recurrence from "../data-fields/recurrence";
import { DateOffset } from "../data-fields/date-offset";
import DebugData from "../data-fields/debug-data";
import RayColor from "../data-fields/ray-color";

export const MappedField = (props) => {
    switch (props.type) {
        case "post_query":
            return (
                <PostQuery {...props} />
            );
        case "date_offset":
            return (
                <DateOffset {...props} />
            );
        case "recurrence":
            return (
                <Recurrence {...props} />
            );
        case "debug_data":
            return (
                <DebugData {...props} />
            );
        case "ray_color":
            return (
                <RayColor {...props} />
            );
    }

    return (
        <i>{sprintf(__('Field type %s is not implemented', 'publihspress-future-pro'), props.name)}</i>
    );
}

export default MappedField;
