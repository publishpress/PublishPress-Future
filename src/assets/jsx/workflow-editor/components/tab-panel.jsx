/**
 * External dependencies
 */
import classnames from 'classnames';

import partial from 'lodash/partial';
import noop from 'lodash/noop';
import find from 'lodash/find';

/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { NavigableMenu, Button } from '@wordpress/components';

const TabButton = ({ tabId, onClick, children, selected, ...rest }) => (
	<Button
		role="tab"
		tabIndex={selected ? null : -1}
		aria-selected={selected}
		id={tabId}
		onClick={onClick}
		{...rest}
	>
		{children}
	</Button>
);

/**
 * This is a clone of the TabPanel component from @wordpress/components.
 * We need to clone it because the original TabPanel component was not working
 * correctly when the initialTabName was set to a tab that was not the first tab.
 */

export function TabPanel({
	className,
	children,
	tabs,
	initialTabName,
	orientation = 'horizontal',
	activeClass = 'is-active',
	onSelect = noop,
}) {
	const instanceId = useInstanceId(TabPanel, 'tab-panel');
	const [selected, setSelected] = useState(null);

	const handleClick = (tabKey) => {
		setSelected(tabKey);
		onSelect(tabKey);
	};

	const onNavigate = (childIndex, child) => {
		child.click();
	};
	const selectedTab = find(tabs, { name: selected });
	const selectedId = `${instanceId}-${selectedTab?.name ?? 'none'}`;

	useEffect(() => {
		const newSelectedTab = find(tabs, { name: selected });

		if (!newSelectedTab) {
			setSelected(
				initialTabName || (tabs.length > 0 ? tabs[0].name : null)
			);
		}
	}, [tabs]);

	// Fix the initialTabName not working when set to a tab that is not the first tab.
	useEffect(() => {
		if (initialTabName) {
			setSelected(initialTabName);
			return;
		}

		setSelected(tabs[0].name);
	}, [initialTabName]);

	return (
		<div className={className}>
			<NavigableMenu
				role="tablist"
				orientation={orientation}
				onNavigate={onNavigate}
				className="components-tab-panel__tabs block-editor-inserter__tablist-and-close-button"
			>
				{tabs.map((tab) => (
					<TabButton
						className={classnames(
							'components-tab-panel__tabs-item',
							tab.className,
							{
								[activeClass]: tab.name === selected,
							}
						)}
						tabId={`${instanceId}-${tab.name}`}
						aria-controls={`${instanceId}-${tab.name}-view`}
						selected={tab.name === selected}
						key={tab.name}
						onClick={partial(handleClick, tab.name)}
					>
						{tab.title}
					</TabButton>
				))}
			</NavigableMenu>
			{selectedTab && (
				<div
					key={selectedId}
					aria-labelledby={selectedId}
					role="tabpanel"
					id={`${selectedId}-view`}
					className="components-tab-panel__tab-content block-editor-inserter__tabpanel"
				>
					{children(selectedTab)}
				</div>
			)}
		</div>
	);
}

export default TabPanel;
