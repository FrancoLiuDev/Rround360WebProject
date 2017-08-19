const webpackDevMiddleware = require("webpack-dev-middleware");
const WebpackHotMiddleware = require('webpack-hot-middleware')
const webpack = require("webpack");
const webpackConfig = require("../webpack.config");
const compiler = webpack(webpackConfig);
const webpackDev = function(app) {
    app.use(webpackDevMiddleware(compiler, {
        publicPath: 'http://localhost/',
        noInfo: true,
    }));
    app.use(WebpackHotMiddleware(compiler));
}
module.exports = webpackDev;
