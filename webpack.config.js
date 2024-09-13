const glob = require("glob");
const path = require("path");

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const defaultExternals = {
    "react": "React",
    "react-dom": "ReactDOM",
    "&wp": "wp",
    "@wordpress/element": "wp.element",
    "@wordpress/components": "wp.components",
    "@wordpress/data": "wp.data",
    "@wordpress/plugins": "wp.plugins",
    "@wordpress/hooks": "wp.hooks",
    "@wordpress/url": "wp.url",
    'jquery': 'jQuery',
};

const defaultRules = [
    {
        test: /\.(jsx)$/, // Identifies which file or files should be transformed.
        use: {loader: "babel-loader"}, //
        exclude: [
            /(node_modules|bower_components)/,
        ]// JavaScript files to be ignored.
    },
    {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
    }
];

const defaultResolve = {
    extensions: ['.js', '.jsx']
};

const defaultModule = {
    rules: [
        ...defaultRules,
    ]
};

const defaultOutput = {
    path: path.join(__dirname, "assets", "js"),
}

const defaultExports = {
    devtool: 'source-map',
    resolve: {...defaultResolve},
    module: {...defaultModule},
}

module.exports = [
    {
        ...defaultExports,
        entry: glob.sync("./assets/jsx/settings-post-types.jsx",),
        output: {...defaultOutput, filename: "settings-post-types.js"},
        externals: {
            ...defaultExternals,
            "&config.settings-post-types": "publishpressFutureSettingsConfig"
        }
    },
    {
        ...defaultExports,
        entry: glob.sync("./assets/jsx/settings-general.jsx",),
        output: {
            ...defaultOutput,
            filename: "settings-general.js"
        },
        externals: {
            ...defaultExternals,
            "&config.settings-general": "publishpressFutureSettingsGeneralConfig"
        }
    },
    {
        ...defaultExports,
        entry: glob.sync(
            "./assets/jsx/block-editor.jsx",
        ),
        output: {
            ...defaultOutput,
            filename: "block-editor.js"
        },
        externals: {
            ...defaultExternals,
            "&window": "window",
            "&config.block-editor": "publishpressFutureBlockEditorConfig"
        }
    },
    {
        ...defaultExports,
        entry: glob.sync(
            "./assets/jsx/classic-editor.jsx",
        ),
        output: {
            ...defaultOutput,
            filename: "classic-editor.js"
        },
        externals: {
            ...defaultExternals,
            "&config.classic-editor": "publishpressFutureClassicEditorConfig"
        }
    },
    {
        ...defaultExports,
        entry: glob.sync(
            "./assets/jsx/quick-edit.jsx",
        ),
        output: {
            ...defaultOutput,
            filename: "quick-edit.js"
        },
        externals: {
            ...defaultExternals,
            "&config.quick-edit": "publishpressFutureQuickEditConfig",
            "&window": "window",
        }
    },
    {
        ...defaultExports,
        entry: glob.sync(
            "./assets/jsx/bulk-edit.jsx",
        ),
        output: {
            ...defaultOutput,
            filename: "bulk-edit.js"
        },
        externals: {
            ...defaultExternals,
            "&config.bulk-edit": "publishpressFutureBulkEditConfig",
            "&window": "window",
        }
    },
    {
        ...defaultExports,
        entry: glob.sync(
            "./assets/jsx/settings-advanced.jsx",
        ),
        output: {
            ...defaultOutput,
            filename: "settings-advanced.js"
        },
        externals: {
            ...defaultExternals,
        }
    },
    {
        ...defaultExports,
        entry: glob.sync(
            "./assets/jsx/workflow-editor/index.jsx",
        ),
        output: {
            ...defaultOutput,
            filename: "workflow-editor.js"
        },
        plugins: [
            // other plugins
            new BundleAnalyzerPlugin(),
        ],
        externals: {
            ...defaultExternals,
            'future-workflow-editor': 'futureWorkflowEditor',
        }
    },
    {
        ...defaultExports,
        entry: glob.sync(
            "./assets/jsx/legacy-action/index.jsx",
        ),
        output: {
            ...defaultOutput,
            filename: "legacy-action.js"
        },
        externals: {
            ...defaultExternals,
            'future-workflow-editor': 'futureWorkflowEditor',
        }
    },
    {
        ...defaultExports,
        entry: glob.sync(
            "./assets/jsx/workflow-manual-selection/quick-edit/index.jsx",
        ),
        output: {
            ...defaultOutput,
            filename: "workflow-manual-selection-quick-edit.js"
        },
        externals: {
            ...defaultExternals,
            'future-workflow-editor': 'futureWorkflowEditor',
        }
    },
    {
        ...defaultExports,
        entry: glob.sync(
            "./assets/jsx/workflow-manual-selection/classic-editor/index.jsx",
        ),
        output: {
            ...defaultOutput,
            filename: "workflow-manual-selection-classic-editor.js"
        },
        externals: {
            ...defaultExternals,
            'future-workflow-editor': 'futureWorkflowEditor',
        }
    },
    {
        ...defaultExports,
        entry: glob.sync(
            "./assets/jsx/workflow-manual-selection/block-editor/index.jsx",
        ),
        output: {
            ...defaultOutput,
            filename: "workflow-manual-selection-block-editor.js"
        },
        externals: {
            ...defaultExternals,
            'future-workflow-editor': 'futureWorkflowEditor',
        }
    }
];
