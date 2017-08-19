var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
console.info('process.env.NODE_ENV=', process.env.NODE_ENV);
var entryMain = ['./src/main.js'];
var output = {
    filename: './js/[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
}
const plugins = [
    new CleanWebpackPlugin(['dist']),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function(module) {
            return module.context && module.context.indexOf('node_modules') !== -1;
        }
    }),
    new ExtractTextPlugin({ filename: 'css/[name].bundle.css', disable: false, allChunks: true }),
    new HtmlWebpackPlugin({
        title: 'Oview Pro W1',
        template: './src/index.html',
    }),
    /* Compile replacement variables */
    new webpack.DefinePlugin(require('./env.js')),
]
if (process.env.NODE_ENV === 'production') {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        compress: {
            warnings: false,
            drop_console: false,
        },
        comments: false,
    }));
} else {
    plugins.push(new webpack.HotModuleReplacementPlugin());
    entryMain.push(hotMiddlewareScript);
    output.publicPath = 'http://localhost/';
}
var webpackConfig = {
    entry: {
        main: entryMain,
    },
    output: output,
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js',
            'pixi.js': 'pixi.js/dist/pixi.min.js',
            'types': path.resolve(__dirname, 'src', 'store', 'types.js'),
            'modules': path.resolve(__dirname, 'src', 'store', 'modules'),
            'component': path.resolve(__dirname, 'src', 'component'),
            'style': path.resolve(__dirname, 'src', 'style'),
        }
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    css: ExtractTextPlugin.extract({
                        use: "css-loader!less-loader",
                        fallback: "vue-style-loader"
                    }),
                    js: [{
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015', 'stage-3'],
                            plugins: ['transform-runtime']
                        }
                    }]
                },
                postcss: [require('autoprefixer')({ browsers: ['last 2 versions'] })],
            }
        }, {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'stage-3'],
                plugins: ['transform-runtime']
            }
        }, {
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader'
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: function() {
                            return [
                                require('autoprefixer')
                            ]
                        }
                    },
                }, {
                    loader: 'less-loader',
                }]
            }),
        }, {
            test: /\.jpg?$|\.jpeg?$|\.gif?$|\.png?$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 100000,
                    outputPath: 'images/'
                }
            }, {
                loader: 'img-loader',
                options: {
                    progressive: true
                }
            }]
        }]
    },
    plugins: plugins,
}
if (process.env.NODE_ENV === 'production') {
    webpackConfig.devtool = false
} else {
    webpackConfig.devtool = 'cheap-module-source-map'
}
module.exports = webpackConfig;
