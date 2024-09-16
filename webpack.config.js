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
            "&config.pro-settings": "publishpressFutureProSettings",
            '&wp': 'wp',
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
            extensions: [".js", ".jsx"],
            alias: {
                "&publishpress-free": path.join(__dirname, "lib", "vendor", "publishpress", "publishpress-future", "assets", "jsx")
            }
        },
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            '@wordpress/blocks': 'wp.blocks',
            '&wp': 'wp',
        }
    }
];
