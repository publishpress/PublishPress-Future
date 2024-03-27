/**
 * External dependencies
 */
import { noop } from 'lodash';

/**
 * Internal dependencies
 */
import { InserterMenu } from './menu';

export function InserterLibrary({
    isAppender,
    showInserterHelpPanel,
    showMostUsedNodes = true,
    onSelect = noop,
    shouldFocusBlock = false,
}) {
    return (
        <InserterMenu
            onSelect={onSelect}
            isAppender={isAppender}
            showInserterHelpPanel={showInserterHelpPanel}
            showMostUsedNodes={showMostUsedNodes}
            shouldFocusBlock={shouldFocusBlock}
        />
    );
}
