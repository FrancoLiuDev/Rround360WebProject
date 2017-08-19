/**
 * @file 
 * 檔案下載 API<br>
 * 取得真實路徑 API
 */
const logPluin = require('./logPlugin.js')
const LOGME = 'fileApi'
logPluin.setLogLv(LOGME)
const log = logPluin.getLog(LOGME)
const request = require('request')
const fs = require('fs');
const unzip = require('unzip');
const config = require('../config.json');
const ReqTkHandle = require('./reqTkHandle.js')
const RefreshTokenHandler = require('./refreshTokenHandler.js')
const FP_API = config.API.fp.name;
const R360FP_API = config.API.r360fp.name;
const PCX_DIR = './pcx';
const API_SERVER = process.env.API_PORT_18000_TCP_ADDR ?
    "http://" + process.env.API_PORT_18000_TCP_ADDR + ":" + process.env.API_PORT_18000_TCP_PORT : config.API_SERVER;
const ADMIN_FP_API = API_SERVER + config.API.fp.admin_api;
const ADMIN_R360FP_API = API_SERVER + config.API.r360fp.admin_api;

/* 解壓 */
const exzip = (zipFile, filePah) => {
    return new Promise((resolve, reject) => {
        fs.createReadStream('./tmp/' + zipFile).pipe(unzip.Extract({ path: filePah + '/' + zipFile }))
            .on('close', (e) => {
                clearTmp(zipFile);
                resolve(zipFile);
            })
            .on('error', (e) => reject(e));
    });
}


/* 取得內部路徑名 */
const getPcx = (key, req) => {
    log('getPcx => ', key);
    return downloadByApi(key, ADMIN_FP_API + key, req)
        .then((key) => exzip(key, PCX_DIR));
}


/* 取得內部路徑名，沒有即下載 */
const loadDirName = (key, req) => {
    log('loadDirName => ', key);
    return new Promise((resolve, reject) => {
        fs.readdir('pcx/' + key, function(err, list) {
            if (err) {
                getPcx(key, req).then((key) => {
                    fs.readdir('pcx/' + key, (err, list) => {
                        resolve(list[0]);
                    });
                }).catch((err) => {
                    reject(err);
                });
            } else {
                if (list.length == 0) {
                    getPcx(key, req).then((key) => {
                        fs.readdir('pcx/' + key, (err, list) => {
                            resolve(list[0]);
                        });
                    }).catch((err) => {
                        reject(err);
                    });
                } else {
                    resolve(list[0]);
                }
            }
        });
    });
}

/* 清理暫存檔 */
const clearTmp = (key) => {
    log('clearTmp', key);
    fs.unlink('tmp/' + key, function(err) {
        if (err) return console.log(err);
        log('clearTmp end', key);
    });
}


/* download */
const downloadByApi = (fileName, url, req) => {
    log('downloadByApi => ', fileName, url);
    return new Promise(async function(resolve, reject) {
        const file = fs.createWriteStream('tmp/' + fileName)
        try {
            await RefreshTokenHandler.refreshTokenSys(req)
            request.get({
                url: url,
                headers: ReqTkHandle.tokenMed(req),
            }).on('error', function(err) {
                reject(err)
            }).on('end', () => {
                resolve(fileName)
            }).pipe(file)
        } catch (err) {
            reject(err)
        }
    });
}

/**
 * 檔案下載 API<br>
 * 取得真實路徑 API
 * @class
 * @param  {Object} app Express.app
 */
const fileApi = (app) => {
    log('file api init!!');
    /**
     * 取得單一檔
     */
    app.get(FP_API + ':fpKey', async function(req, res) {
        let fpKey = req.params.fpKey;
        log('ADMIN_FP_API => ', ADMIN_FP_API + fpKey);
        try {
            await RefreshTokenHandler.rpByRef({
                method: 'GET',
                url: ADMIN_FP_API + fpKey,
                headers: ReqTkHandle.tokenMed(req),
                json: true,
            }, req, res)
        } catch (err) {
            loge(FP_API + fpKey, err);
            res.status(err.statusCode).json(ReqTkHandle.errRes(err))
        }

    });

    /**
     * 取得R360單一檔
     */
    app.get(R360FP_API + ':fpKey', async function(req, res) {
        let fpKey = req.params.fpKey
        log('ADMIN_R360FP_API =>', ADMIN_R360FP_API + fpKey)
        try {
            await RefreshTokenHandler.rpByRef({
                method: 'GET',
                url: ADMIN_R360FP_API + fpKey,
                headers: ReqTkHandle.tokenMed(req),
                json: true,
            }, req, res)
        } catch (err) {
            loge(ADMIN_R360FP_API + fpKey, ReqTkHandle.loge(err))
            res.status(err.statusCode).json(ReqTkHandle.errRes(err))
        }
    });

    /**
     * 取回真實路徑 API
     */
    app.get('/ck/:fpKey', (req, res) => {
        let fpKey = req.params.fpKey;
        log('/ck/' + fpKey);
        loadDirName(fpKey, req).then((name) => {
            res.json({
                result: true,
                path: '/' + fpKey + '/' + name + '/'
            });
        }).catch((err) => {
            loge('load file ' + fpKey, err)
            res.json(ReqTkHandle.errRes(err))
        });
    });
}

module.exports = fileApi;
