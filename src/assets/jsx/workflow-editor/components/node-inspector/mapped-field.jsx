import PostQuery from "../data-fields/post-query";
import { __, sprintf } from "@wordpress/i18n";
import Recurrence from "../data-fields/recurrence";
import { DateOffset } from "../data-fields/date-offset";
import DebugData from "../data-fields/debug-data";
import RayColor from "../data-fields/ray-color";
import Text from "../data-fields/text";
import TaxonomyTerms from "../data-fields/taxonomy-terms";
import PostStatus from "../data-fields/post-status";

export const MappedField = (props) => {
    switch (props.type) {
        case "postQuery":
            return (
                <PostQuery {...props} />
            );
        case "postStatus":
            return (
                <PostStatus {...props} />
            );
        case "taxonomyTerms":
            return (
                <TaxonomyTerms {...props} />
            );
        case "dateOffset":
            return (
                <DateOffset {...props} />
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
