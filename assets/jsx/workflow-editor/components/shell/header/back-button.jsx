import { useSelect } from "@wordpress/data";
import { Button, Icon } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { addQueryArgs } from '@wordpress/url';
import { wordpress } from '@wordpress/icons';
import { store as workflowStore } from '../../workflow-store';
import { useFeature } from '../../preferences/use-feature';
import { FEATURE_FULLSCREEN_MODE, POST_TYPE } from '../../../constants';

export function FullscreenModeClose({ showTooltip }) {
    const isActive = useFeature(FEATURE_FULLSCREEN_MODE);
    const postType = useSelect(
        (select) => select(workflowStore).getPostType(),
        []
    );

    if (!isActive || !postType) {
        return null;
    }

    return (
        <Button
            className="future-workflow-editor-header__back"
            href={
                addQueryArgs('edit.php', {
                    post_type: POST_TYPE,
                })
            }
            label={__('Back', 'post-expirator')}
            showTooltip={showTooltip}
        >
            <Icon size="36px" icon={wordpress} />
        </Button>
    );
}
