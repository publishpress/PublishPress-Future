import { PanelRow, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect, dispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

import { FutureActionPanelAfterActionField } from '../../../../lib/vendor/publishpress/publishpress-future/assets/jsx/components/FutureActionPanelAfterActionField';

const Fields = ({ storeName }) => {
    const workflowsOptions = futureWorkflows.workflows;

    const defaultWorkflow = workflowsOptions.length > 0 ? workflowsOptions[0].value : 0;

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
        console.log('handleActionChange', value);
        setExtraDataByName('workflow', value);
    }

    useEffect(() => {
        handleActionChange(defaultWorkflow);
    }, []);

    return (
        <>
            {workflowsOptions.length > 0 && action === 'trigger-workflow' &&
                <PanelRow className='future-action-panel-content future-action-full-width'>
                    <SelectControl
                        label={__('Workflow to trigger', 'publishpress-future-pro')}
                        value={workflow}
                        options={workflowsOptions}
                        onChange={handleActionChange}
                    />
                    <input type='hidden' name='future_action_pro_workflow' value={workflow} />
                </PanelRow>
            }

            { workflowsOptions.length === 0 && action === 'trigger-workflow' &&
                <PanelRow className='future-action-panel-content future-action-full-width'>
                    <p>{__('No compatible workflows available.', 'publishpress-future-pro')}</p>
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
