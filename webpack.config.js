const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const LodashWebpackPlugin = require("lodash-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const dfxJson = require("./dfx.json");

// List of all aliases for canisters. This creates the module alias for
// the `import ... from "@dfinity/ic/canisters/xyz"` where xyz is the name of a
// canister.
const aliases = Object.entries(dfxJson.canisters).reduce(
    (acc, [name, _value]) => {
        // Get the network name, or `local` by default.
        const networkName = process.env["DFX_NETWORK"] || "local";
        const outputRoot = path.join(
            __dirname,
            ".dfx",
            networkName,
            "canisters",
            name
        );

        return {
            ...acc,
            ["dfx-generated/" + name]: path.join(outputRoot, name + ".js"),
            'vue$': 'vue/dist/vue.esm.js',
        };
    },
    {}
);

/**
 * Generate a webpack configuration for a canister.
 */
function generateWebpackConfigForCanister(name, info) {
    if (typeof info.frontend !== "object") {
        return;
    }

    return {
        mode: "production",
        // entry: {
        //   // The frontend.entrypoint points to the HTML file for this build, so we need
        //   // to replace the extension to `.js`.
        //   index: path.join(__dirname, info.frontend.entrypoint).replace(/\.html$/, ".js"),
        //   bootstrap: 'bootstrap-loader',
        // },
        entry: [
            // The frontend.entrypoint points to the HTML file for this build, so we need
            // to replace the extension to `.js`.
            path.join(__dirname, info.frontend.entrypoint).replace(/\.html$/, ".js"),
            'bootstrap-loader',
        ],
        devtool: "source-map",
        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin()],
        },
        resolve: {
            alias: aliases,
            extensions: [".js", ".ts", ".jsx", ".tsx", '.vue'],
            fallback: {
                "assert": require.resolve("assert/"),
                "buffer": require.resolve("buffer/"),
                "events": require.resolve("events/"),
                "stream": require.resolve("stream-browserify/"),
                "util": require.resolve("util/"),
            },
        },
        output: {
            //filename: "[name].js",
            filename: "index.js",
            path: path.join(__dirname, "dist", name),
        },

        // Depending in the language or framework you are using for
        // front-end development, add module loaders to the default
        // webpack configuration. For example, if you are using React
        // modules and CSS as described in the "Adding a stylesheet"
        // tutorial, uncomment the following lines:
        // module: {
        //  rules: [
        //    { test: /\.(ts|tsx|jsx)$/, loader: "ts-loader" },
        //    { test: /\.css$/, use: ['style-loader','css-loader'] }
        //  ]
        // },
        plugins: [
            new LodashWebpackPlugin,
            new VueLoaderPlugin,
            new HtmlWebpackPlugin({
                template: path.join(__dirname, info.frontend.entrypoint),
                filename: 'index.html',
                //chunks: ['index', 'bootstrap'],
            }),
            new webpack.ProvidePlugin({
                Buffer: [require.resolve('buffer/'), 'Buffer'],
                process: require.resolve('process/browser'),
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery",
                Tether: "tether",
                "window.Tether": "tether",
                Popper: ['popper.js', 'default'],
                Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
                Button: "exports-loader?Button!bootstrap/js/dist/button",
                Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
                Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
                Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
                Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
                Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
                Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
                Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
                Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
                Util: "exports-loader?Util!bootstrap/js/dist/util",
                TWEEN: "@tweenjs/tween.js"
            }),
        ],

        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    '@vue/cli-plugin-babel/preset'
                                ],
                                plugins: ["lodash", ["import", {
                                    libraryName: "ant-design-vue",
                                    libraryDirectory: "es",
                                    style: false,   // 如果使用less样式，则style值为true，否则style值为'css'
                                }]]
                            }
                        },
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.vue$/,
                    use: ['vue-loader'],
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: ["vue-style-loader", "css-loader"],
                    exclude: /node_modules/
                },
                {
                    resourceQuery: /blockType=i18n/,
                    type: 'javascript/auto',
                    use: ['@kazupon/vue-i18n-loader']
                },
            ]
        },
    };
}

// If you have additional webpack configurations you want to build
//  as part of this configuration, add them to the section below.
module.exports = [
    ...Object.entries(dfxJson.canisters)
        .map(([name, info]) => {
            return generateWebpackConfigForCanister(name, info);
        })
        .filter((x) => !!x),
];
