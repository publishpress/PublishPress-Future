const glob = require("glob");
const path = require("path");

module.exports = [
    {
        entry: glob.sync(
            "./assets/jsx/block-editor.jsx",
        ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "assets", "js"),
            filename: "block-editor.js"
        },
        resolve: {
            extensions: ['.jsx', '.js']
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
        }
    },
    {
        entry: glob.sync(
            "./assets/jsx/settings-post-types.jsx",
        ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "assets", "js"),
            filename: "settings-post-types.js"
        },
        resolve: {
            extensions: ['.jsx', '.js']
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
            extensions: ['.js', '.jsx']
        }
    },
    {
        entry: glob.sync(
            "./assets/jsx/classic-editor.jsx",
        ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "assets", "js"),
            filename: "classic-editor.js"
        },
        resolve: {
            extensions: ['.jsx', '.js']
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
        }
    },
    {
        entry: glob.sync(
            "./assets/jsx/quick-edit.jsx",
        ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "assets", "js"),
            filename: "quick-edit.js"
        },
        resolve: {
            extensions: ['.jsx', '.js']
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
        }
    },
    {
        entry: glob.sync(
            "./assets/jsx/bulk-edit.jsx",
        ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "assets", "js"),
            filename: "bulk-edit.js"
        },
        resolve: {
            extensions: ['.jsx', '.js']
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
        }
    }
];
