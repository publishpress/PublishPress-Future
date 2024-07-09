var glob = require("glob");
var path = require("path");

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = [
    {
        entry: glob.sync(
            "./src/assets/jsx/settings/*.jsx",
        ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "src", "assets", "js"),
            filename: "settings.js"
        },
        module: {
            rules: [
                {
                    test: /\.(jsx)$/, // Identifies which file or files should be transformed.
                    use: {loader: "babel-loader"}, // Babel loader to transpile modern JavaScript.
                    exclude: [
                        /(node_modules|bower_components)/,
                    ]// JavaScript files to be ignored.
                }
            ]
        },
        resolve: {
            modules: [
                "node_modules",
                path.join(__dirname, "vendor", "publishpress")
            ],
            extensions: [".js", ".jsx"],
            alias: {
                "&publishpress-free": path.join(__dirname, "lib", "vendor", "publishpress", "publishpress-future", "assets", "jsx")
            }
        },
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            "&wp": "wp",
            "@wordpress/components": "wp.components",
            "@wordpress/data": "wp.data",
            "@wordpress/plugins": "wp.plugins",
            "@wordpress/url": "wp.url",
            "@wordpress/hooks": "wp.hooks",
            "@wordpress/element": "wp.element",
            "&config.classic-editor": "publishpressFutureClassicEditorConfig",
            "&config.pro-settings": "publishpressFutureProSettings"
        },
    },
    {
        entry: glob.sync(
            "./src/assets/jsx/block-editor.jsx",
        ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "src", "assets", "js"),
            filename: "block-editor.js"
        },
        module: {
            rules: [
                {
                    test: /\.(jsx)$/, // Identifies which file or files should be transformed.
                    use: {loader: "babel-loader"}, // Babel loader to transpile modern JavaScript.
                    exclude: [
                        /(node_modules|bower_components)/,
                    ]// JavaScript files to be ignored.
                }
            ]
        },
        resolve: {
            modules: [
                "node_modules",
                path.join(__dirname, "vendor", "publishpress")
            ],
            extensions: [".js", ".jsx"],
            alias: {
                "&publishpress-free": path.join(__dirname, "lib", "vendor", "publishpress", "publishpress-future", "assets", "jsx")
            }
        },
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            '@wordpress/blocks': 'wp.blocks',
        }
    },
    {
        entry: glob.sync(
            "./src/assets/jsx/workflow-editor/index.jsx",
        ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "src", "assets", "js"),
            filename: "workflow-editor.js"
        },
        module: {
            rules: [
                {
                    test: /\.(jsx)$/, // Identifies which file or files should be transformed.
                    use: {loader: "babel-loader"}, // Babel loader to transpile modern JavaScript.
                    exclude: [
                        /(node_modules|bower_components)/,
                    ]// JavaScript files to be ignored.
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader", "postcss-loader"],
                }
            ]
        },
        plugins: [
            // other plugins
            new BundleAnalyzerPlugin(),
        ],
        resolve: {
            modules: [
                "node_modules",
                path.join(__dirname, "vendor", "publishpress")
            ],
            extensions: [".js", ".jsx"]
        },
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            '@wordpress/data': 'wp.data',
            '@wordpress/element': 'wp.element',
            '@wordpress/components': 'wp.components',
            '@wordpress/i18n': 'wp.i18n',
            '@wordpress/plugins': 'wp.plugins',
            'future-workflow-editor': 'futureWorkflowEditor',
            'jquery': 'jQuery',
        }
    },
    {
        entry: glob.sync(
            "./src/assets/jsx/legacy-action/index.jsx",
        ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "src", "assets", "js"),
            filename: "legacy-action.js"
        },
        module: {
            rules: [
                {
                    test: /\.(jsx)$/, // Identifies which file or files should be transformed.
                    use: {loader: "babel-loader"}, // Babel loader to transpile modern JavaScript.
                    exclude: [
                        /(node_modules|bower_components)/,
                    ]// JavaScript files to be ignored.
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader", "postcss-loader"],
                }
            ]
        },
        resolve: {
            modules: [
                "node_modules",
                path.join(__dirname, "vendor", "publishpress")
            ],
            extensions: [".js", ".jsx"]
        },
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            '@wordpress/data': 'wp.data',
            '@wordpress/element': 'wp.element',
            '@wordpress/components': 'wp.components',
            '@wordpress/i18n': 'wp.i18n',
            '@wordpress/plugins': 'wp.plugins',
            'future-workflow-editor': 'futureWorkflowEditor',
        }
    },
    {
        entry: glob.sync(
            "./src/assets/jsx/workflow-manual-selection/quick-edit/index.jsx",
        ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "src", "assets", "js"),
            filename: "workflow-manual-selection-quick-edit.js"
        },
        module: {
            rules: [
                {
                    test: /\.(jsx)$/, // Identifies which file or files should be transformed.
                    use: {loader: "babel-loader"}, // Babel loader to transpile modern JavaScript.
                    exclude: [
                        /(node_modules|bower_components)/,
                    ]// JavaScript files to be ignored.
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader", "postcss-loader"],
                }
            ]
        },
        resolve: {
            modules: [
                "node_modules",
                path.join(__dirname, "vendor", "publishpress")
            ],
            extensions: [".js", ".jsx"]
        },
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            '@wordpress/data': 'wp.data',
            '@wordpress/element': 'wp.element',
            '@wordpress/components': 'wp.components',
            '@wordpress/i18n': 'wp.i18n',
            '@wordpress/plugins': 'wp.plugins',
            'future-workflow-editor': 'futureWorkflowEditor',
        }
    },
    {
        entry: glob.sync(
            "./src/assets/jsx/workflow-manual-selection/classic-editor/index.jsx",
        ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "src", "assets", "js"),
            filename: "workflow-manual-selection-classic-editor.js"
        },
        module: {
            rules: [
                {
                    test: /\.(jsx)$/, // Identifies which file or files should be transformed.
                    use: {loader: "babel-loader"}, // Babel loader to transpile modern JavaScript.
                    exclude: [
                        /(node_modules|bower_components)/,
                    ]// JavaScript files to be ignored.
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader", "postcss-loader"],
                }
            ]
        },
        resolve: {
            modules: [
                "node_modules",
                path.join(__dirname, "vendor", "publishpress")
            ],
            extensions: [".js", ".jsx"]
        },
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            '@wordpress/data': 'wp.data',
            '@wordpress/element': 'wp.element',
            '@wordpress/components': 'wp.components',
            '@wordpress/i18n': 'wp.i18n',
            '@wordpress/plugins': 'wp.plugins',
            'future-workflow-editor': 'futureWorkflowEditor',
        }
    },
    {
        entry: glob.sync(
            "./src/assets/jsx/workflow-manual-selection/block-editor/index.jsx",
        ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "src", "assets", "js"),
            filename: "workflow-manual-selection-block-editor.js"
        },
        module: {
            rules: [
                {
                    test: /\.(jsx)$/, // Identifies which file or files should be transformed.
                    use: {loader: "babel-loader"}, // Babel loader to transpile modern JavaScript.
                    exclude: [
                        /(node_modules|bower_components)/,
                    ]// JavaScript files to be ignored.
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader", "postcss-loader"],
                }
            ]
        },
        resolve: {
            modules: [
                "node_modules",
                path.join(__dirname, "vendor", "publishpress")
            ],
            extensions: [".js", ".jsx"]
        },
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            '@wordpress/data': 'wp.data',
            '@wordpress/element': 'wp.element',
            '@wordpress/components': 'wp.components',
            '@wordpress/i18n': 'wp.i18n',
            '@wordpress/plugins': 'wp.plugins',
            'future-workflow-editor': 'futureWorkflowEditor',
        }
    }
];
