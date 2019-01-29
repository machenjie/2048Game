let path = require("path");
let webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const LodashWebpackPlugin = require("lodash-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    mode: "development",
    entry: ["./src/main.js",
        'bootstrap-loader'
    ],
    output: {
        filename: "build.js",
        path: path.resolve("./dist")
    },
    devServer: {
        contentBase : "./dist",
        port : 9090,
        compress : true,
        index: "index.html"
    },
    module: {
        rules: [
            {
                test : /\.js$/,
                loader : 'babel-loader',
                exclude: /node_modules/,
                options: {
                    'plugins': ['lodash'],
                    'presets': [['@babel/preset-env', {
                        targets: {
                            "node": process.versions.node
                        },
                        useBuiltIns: "usage",
                    }]]
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: 'vue-style-loader!css-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
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
        new HtmlWebpackPlugin({
            template: path.resolve("./src/index.html"),
            filename: "./index.html"
        }),
        new LodashWebpackPlugin,
        new VueLoaderPlugin
    ],
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'vue-router$': 'vue-router/dist/vue-router.esm.js',
        }
    }
};