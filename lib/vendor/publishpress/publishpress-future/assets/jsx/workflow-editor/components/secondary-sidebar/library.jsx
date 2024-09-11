/**
 * External dependencies
 */
import noop from 'lodash/noop';

/**
 * Internal dependencies
 */
import { InserterMenu } from './menu';

export function InserterLibrary({
    isAppender,
    showInserterHelpPanel,
    showMostUsedNodes = true,
    onSelect = noop,
    shouldFocusNode = false,
}) {
    return (
        <InserterMenu
            onSelect={onSelect}
            isAppender={isAppender}
            showInserterHelpPanel={showInserterHelpPanel}
            showMostUsedNodes={showMostUsedNodes}
            shouldFocusNode={shouldFocusNode}
        />
    );
}
