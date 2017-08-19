/**
 * @file
 * R360相關API
 */
const logPluin = require('./logPlugin.js')
const LOGME = 'r360Api'
logPluin.setLogLv(LOGME)
const log = logPluin.getLog(LOGME)
const loge = logPluin.getError(LOGME)
const fs = require('fs-extra');
const request = require('request');
const unzip = require('unzip');
const config = require('../config.json');
const ReqTkHandle = require('./reqTkHandle.js');
const RefreshTokenHandler = require('./refreshTokenHandler.js')
const API_SERVER = process.env.API_PORT_18000_TCP_ADDR ?
    "http://" + process.env.API_PORT_18000_TCP_ADDR + ":" + process.env.API_PORT_18000_TCP_PORT : config.API_SERVER;
const R360_LIST = config.API.r360List.name;
const ADMIN_R360_LIST = config.API.r360List.admin_api;
const R360_PAG = config.API.r360pag.name;
const R360_PAG_BASE = config.API.r360pag.basePath;
module.exports = R360Api;

/**
 * R360相關API
 * @constructor
 * @param  {Object} app Express.app
 */
function R360Api(app) {
    log('R360 api init!!')
        /* R360列表API */
    app.post(R360_LIST, async function(req, res) {
        let qs = {
            limit: req.body.limit || 50,
            offset: req.body.offset || 0,
            sort: req.body.sort || 'desc'
        }
        if (req.body.trans) {
            qs.trans = req.body.trans
        }
        log(API_SERVER + ADMIN_R360_LIST)
        try {
            let resData = await RefreshTokenHandler.rpByRef({
                method: 'GET',
                baseUrl: API_SERVER,
                uri: ADMIN_R360_LIST,
                headers: ReqTkHandle.tokenMed(req),
                qs: qs,
                json: true,
            }, req)
            res.json({
                result: true,
                data: resData.data,
            })
        } catch (err) {
            loge(API_SERVER + ADMIN_R360_LIST, ReqTkHandle.loge(err))
            res.json(ReqTkHandle.errRes(err))
        }
    })

    /* 取得R360位置 */
    app.get(R360_PAG + ':zipkey', (req, res) => {
        let zipkey = req.params.zipkey;
        fsStat('./pcx/r360/' + zipkey)
            .then(() => {
                res.json({
                    result: true,
                    data: '/r360/' + zipkey,
                })
            })
            .catch(() => {
                downloadByApi('' + new Date().getTime() + (~~Math.random() * 1000), API_SERVER + '/api/v1/r360/fp/' + zipkey, req)
                    .then((filePath) => {
                        return exzip(filePath, 'pcx/r360/' + zipkey)
                    })
                    .then(() => {
                        res.json({
                            result: true,
                            data: R360_PAG_BASE + zipkey,
                        })
                    })
                    .catch(err => {
                        res.json({
                            result: false,
                            statusCode: 500,
                            code: err,
                        })
                    })
            })

    })
}

/* 檢查檔案是否存在 */
const fsStat = (fileName) => {
    return new Promise((resolve, reject) => {
        fs.readdir(fileName, (err) => {
            return err ? reject(fileName) : resolve(fileName)
        })
    })
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
                resolve(fileName);
            }).pipe(file)
        } catch (err) {
            reject(err)
        }
    })
}

/* 解壓 */
const exzip = (zipFile, filePah) => {
    return new Promise((resolve, reject) => {
        fs.createReadStream('./tmp/' + zipFile).pipe(unzip.Extract({ path: filePah }))
            .on('close', () => {
                clearTmp(zipFile);
                resolve(filePah);
            })
            .on('error', (err) => reject(err))
    });
}

/* 清理暫存檔 */
const clearTmp = (key) => {
    log('clearTmp', key);
    fs.unlink('tmp/' + key, function(err) {
        if (err) {
            loge('clearTmp', err)
        }
        log('clearTmp', key)
    });
}
