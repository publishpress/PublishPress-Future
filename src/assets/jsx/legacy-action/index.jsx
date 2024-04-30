import { FutureActionPanelAfterActionField } from '../../../../lib/vendor/publishpress/publishpress-future/assets/jsx/components/FutureActionPanelAfterActionField';

const LegacyActionFields = () => {
    console.log('Its finally rendering!');

    // Fill
    return (
        <FutureActionPanelAfterActionField>
            <h1>Finally!</h1>
        </FutureActionPanelAfterActionField>
    );
}

wp.plugins.registerPlugin('legacy-action-plugin', { render: LegacyActionFields, scope: 'publishpress-future'});

console.log('Plugin registered!', 'Why is this not being rendered?');

