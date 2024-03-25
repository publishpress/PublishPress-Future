/**
 * External dependencies
 */
import { noop } from 'lodash';

/**
 * Internal dependencies
 */
// import { InserterMenu } from './menu';

export function InserterLibrary({
    isAppender,
    showInserterHelpPanel,
    showMostUsedBlocks = false,
    onSelect = noop,
    shouldFocusBlock = false,
}) {
    return (
        // <InserterMenu
        //     onSelect={onSelect}
        //     isAppender={isAppender}
        //     showInserterHelpPanel={showInserterHelpPanel}
        //     showMostUsedBlocks={showMostUsedBlocks}
        //     __experimentalInsertionIndex={__experimentalInsertionIndex}
        //     __experimentalFilterValue={__experimentalFilterValue}
        //     shouldFocusBlock={shouldFocusBlock}
        // />
        <div>Test</div>
    );
}
