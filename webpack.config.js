var glob = require("glob");
var path = require("path");

module.exports = [
    {
        entry: glob.sync(
            "./assets/jsx/gutenberg-panel/*.jsx",
        ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "assets", "js"),
            filename: "gutenberg-panel.js"
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
            "./assets/jsx/settings/*.jsx",
        ),
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "assets", "js"),
            filename: "settings-post-types.js"
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
    }
];
