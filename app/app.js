/**
 * @file
 * OViewer PRO W2 Server 程式進入點
 */

const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const shrinkRay = require('shrink-ray');
const cors = require('cors');
const path = require('path');
const config = require(path.join(__dirname, '..', 'config.json'));
const siginApi = require('./signApi.js'); //登入API
const h360ListApi = require('./h360Api.js'); //h360 list API
const h360DetailApi = require('./h360DetailApi.js'); //h360 Detail API
const fileApi = require('./fileApi.js'); //檔案 API
const r360Api = require('./r360Api.js'); //R360相關API
const v360Api = require('./v360Api.js') //V360相關API
const PushServer = require('./io.js');
const talkApi = require('./talkApi.js')
const logPluin = require('./logPlugin.js')
logPluin.init()
logPluin.setLogLv('app')
const log = logPluin.getLog('app')
const port = process.env.PORT || config.port || 80;
const app = express();
const server = require('http').createServer(app);
const pushServer = new PushServer(server);
app.set('trust proxy', 3); // trust 3 proxy
app.use(cors());
app.use(shrinkRay());
const expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 7); // 7天
app.use(cookieSession({
    name: 'overpro',
    keys: ['leedian'],
    cookie: {
        // secure: true, //確保瀏覽器只透過 HTTPS 傳送 Cookie。
        httpOnly: true, //確保只透過 HTTP(S) 傳送 Cookie，而不透過用戶端 JavaScript 傳送
        // domain: '127.0.0.1',
        expires: expiryDate
    }
}));
app.use(bodyParser.json({
    limit: '2mb',
}))
app.use(bodyParser.urlencoded({
    extended: true,
}))
siginApi(app); //登入API
h360ListApi(app); //h360 list API
h360DetailApi(app); //h360 Detail API
r360Api(app); //R360 API
fileApi(app); //檔案 API
v360Api(app) //v360相關API
talkApi(app, pushServer)
if (process.env.NODE_ENV === 'develop') {
    const webpackDev = require('./webpackDev.js');
    webpackDev(app);
} else {
    app.use(express.static(path.join(__dirname, '..', 'dist')));
}
app.use(express.static(path.join(__dirname, '..', 'resources'))); //靜態頁面
app.use(express.static(path.join(__dirname, '..', 'language'))); //語系
app.use(express.static(path.join(__dirname, '..', 'pcx'))); //下載h360靜態圖
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
app.use(status404);
server.listen(port, function() {
    log('runing Web Server in ' + port + ' port...');
});

/**
 * 錯誤輸出
 */
function logErrors(err, req, res, next) {
    log('app : logErrors => ', err.stack);
    next(err);
}

/**
 * 500錯誤
 */
function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({
            error: 'Something failed!'
        });
    } else {
        next(err);
    }
}

/**
 * 500錯誤
 */
function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', {
        error: err
    });
}

/**
 * 404錯誤
 */
function status404(req, res) {
    res.status(404).send('404 error');
}
