(function (wp) {
	if (!wp) {
		return;
	}

	const getProperty = (object, path, defaultValue) => {
		const keys = path.split('.');
		let result = object;

		for (const key of keys) {
			if (result && typeof result === 'object' && key in result) {
				result = result[key];
			} else {
				return defaultValue;
			}
		}

		return result !== undefined ? result : defaultValue;
	};

	wp.plugins.registerPlugin('classic-editor-plugin', {
		render: function () {
			var createElement = wp.element.createElement;
			var PluginMoreMenuItem = wp.editPost.PluginMoreMenuItem;
			var url = wp.url.addQueryArgs(document.location.href, { 'classic-editor': '', 'classic-editor__forget': '' });
			var linkText = getProperty(window, ['classicEditorPluginL10n', 'linkText']) || 'Switch to classic editor';

			return createElement(
				PluginMoreMenuItem,
				{
					icon: 'editor-kitchensink',
					href: url,
				},
				linkText
			);
		},
	});
})(window.wp);
