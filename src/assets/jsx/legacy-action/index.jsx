import { FutureActionPanelAfterActionField } from '../../../../lib/vendor/publishpress/publishpress-future/assets/jsx/components/FutureActionPanelAfterActionField';

const LegacyActionFields = () => {
    return (
        <FutureActionPanelAfterActionField>
            <h1>Finally!s</h1>
        </FutureActionPanelAfterActionField>
    );
}

wp.plugins.registerPlugin('legacy-action-plugin', { render: LegacyActionFields, scope: 'publishpress-future'});
