import { useSelect } from "@wordpress/data";
import { Button, Icon } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { addQueryArgs } from '@wordpress/url';
import { wordpress } from '@wordpress/icons';
import { store as workflowStore } from '../../workflow-store';
import { store as editorStore } from '../../editor-store';
import { POST_TYPE } from '../../../constants';

export function FullscreenModeClose({ showTooltip }) {
    const { isActive, postType } = useSelect(
        (select) => {
            const { getPostType } = select(workflowStore);
            const { isFeatureActive } = select(editorStore);

            return {
                isActive: isFeatureActive('fullscreenMode'),
                postType: getPostType(),
            };
        },
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
