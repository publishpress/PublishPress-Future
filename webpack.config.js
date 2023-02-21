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
                path.join(__dirname, "vendor", "publishpress"),
            ],
            extensions: [".js", ".jsx"]
        },
        externals: {
            "react": "React",
            "react-dom": "ReactDOM",
            "react-select": "ReactSelect"
        },
    }
];
