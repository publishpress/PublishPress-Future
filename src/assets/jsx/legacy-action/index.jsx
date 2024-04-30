import { PanelRow, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect, dispatch } from '@wordpress/data';

import { FutureActionPanelAfterActionField } from '../../../../lib/vendor/publishpress/publishpress-future/assets/jsx/components/FutureActionPanelAfterActionField';

const Fields = ({ storeName }) => {
    const workflowsOptions = [
        {
            label: 'Workflow 1',
            value: 'workflow-1',
        },
        {
            label: 'Workflow 2',
            value: 'workflow-2',
        },
    ];

    const defaultWorkflow = workflowsOptions[0].value;

    const {
        action,
        workflow,
    } = useSelect((select) => {
        return {
            action: select(storeName).getAction(),
            workflow: select(storeName).getExtraDataByName('workflow') || defaultWorkflow,
        };
    });

    const {
        setExtraDataByName,
    } = dispatch(storeName);

    const handleActionChange = (value) => {
        setExtraDataByName('workflow', value);
    }

    return (
        <>
            {action === 'trigger-workflow' &&
                <PanelRow className='future-action-panel-content future-action-full-width'>
                    <SelectControl
                        label={__('Workflow to trigger', 'publishpress-future-pro')}
                        value={workflow}
                        options={workflowsOptions}
                        onChange={handleActionChange}
                    />
                </PanelRow>
            }
        </>
    );
}


const LegacyActionFields = () => (
    <FutureActionPanelAfterActionField>
        {({ storeName }) => {
            return <Fields storeName={storeName} />;
        }}
    </FutureActionPanelAfterActionField>

);

wp.plugins.registerPlugin('legacy-action-plugin', { render: LegacyActionFields, scope: 'publishpress-future' });
