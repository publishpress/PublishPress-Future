var glob = require("glob");
var path = require("path");

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
            "&wp.components": "wp.components",
            "&wp.data": "wp.data",
            "&wp.plugins": "wp.plugins",
            "&wp.url": "wp.url",
            "&wp.hooks": "wp.hooks",
            "&wp.element": "wp.element",
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
            'react-dom': 'ReactDOM'
        }
    },
    {
        entry: glob.sync(
            "./src/assets/jsx/workflow-editor/editor.jsx",
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
        }
    }
];
