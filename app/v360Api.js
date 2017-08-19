/**
 * @file
 * V360相關API
 */
const logPluin = require('./logPlugin.js')
const LOGME = 'v360Api'
logPluin.setLogLv(LOGME)
const log = logPluin.getLog(LOGME)
const loge = logPluin.getError(LOGME)
const rp = require('request-promise')
const config = require('../config.json')
const ReqTkHandle = require('./reqTkHandle.js')
const RefreshTokenHandler = require('./refreshTokenHandler.js')
const base64ImagsToBuffer = require('./toolskit.js').base64ImagsToBuffer
const V360API = config.API.v360Creat.name
const V360API_ADMIN = config.API.v360Creat.admin_api
const V360_LIST_API = config.API.v360List.name
const V360_LIST_ADMIN = config.API.v360List.admin_api
const V360_DEL_API = config.API.v360Del.name
const V360_DEL_ADMIN = config.API.v360Del.admin_api
const V360_META_API = config.API.v360Meta.name
const V360_META_ADMIN = config.API.v360Meta.admin_api
const V360_FP_API = config.API.v360Fp.name
const V360_FP_ADMIN = config.API.v360Fp.admin_api
const API_SERVER = process.env.API_PORT_18000_TCP_ADDR ?
    "http://" + process.env.API_PORT_18000_TCP_ADDR + ":" + process.env.API_PORT_18000_TCP_PORT : config.API_SERVER;
const V360_MANAGER = process.env.MAN_PORT_8000_TCP_ADDR ?
    "http://" + process.env.MAN_PORT_8000_TCP_ADDR + ":" + process.env.MAN_PORT_8000_TCP_PORT : config.V360_MANAGER;
module.exports = V360Api;

/**
 * V360相關API
 * @constructor
 * @param  {Object} app Express.app
 */
function V360Api(app) {
    log('V360 api init!!')

    /* 上傳V360Meta與轉檔 */
    app.post(V360API, async function(req, res) {
        let resData
        let formData = {
            thumb: {
                value: base64ImagsToBuffer(req.body.cover),
                options: {
                    filename: 'thumb',
                    contentType: 'image/png',
                }
            },
            name: req.body.name,
            about: req.body.about,
            size: 0,
            tmp: req.body.list,
        }
        try {
            resData = await RefreshTokenHandler.rpByRef({
                method: 'POST',
                uri: API_SERVER + V360API_ADMIN,
                headers: ReqTkHandle.tokenMed(req),
                formData: formData,
                json: true,
            }, req)
        } catch (err) {
            loge(V360API_ADMIN + '=> err...', err)
            res.json(ReqTkHandle.errRes(err))
            return
        }
        if (resData && resData.data && resData.data.mp4key) {
            res.json({
                result: true,
                mp4: resData.data.mp4key,
            })
            try {
                await h360ToV360({
                    list: req.body.list,
                    mp4: resData.data.mp4key,
                    user: resData.data.user,
                    owner: resData.data.owner,
                })
                log(V360API + '=>', 'toMp4...', req.body.list)
            } catch (err) {
                loge(V360API + '=>', resData.data.mp4key, ReqTkHandle.loge(err))
            }
        } else {
            loge(V360API_ADMIN + '=>', 'err...', resData)
            res.json(ReqTkHandle.errRes(err))
        }
    })

    /* V360列表 */
    app.get(V360_LIST_API, async function(req, res) {
        log(API_SERVER + V360_LIST_ADMIN)
        try {
            let resData = await RefreshTokenHandler.rpByRef({
                method: 'GET',
                uri: API_SERVER + V360_LIST_ADMIN,
                headers: ReqTkHandle.tokenMed(req),
                json: true,
            }, req)
            log(V360_LIST_API, 'resData.data.count', resData.data.count)
            res.json({
                result: true,
                data: resData,
            })
        } catch (err) {
            loge(API_SERVER + V360_LIST_ADMIN, ReqTkHandle.loge(err))
            res.json(ReqTkHandle.errRes(err))
        }
    })

    /* 刪除v360 */
    app.get(V360_DEL_API + ':mp4key', async function(req, res) {
        log(V360_DEL_API + ' =>', req.params.mp4key)
        try {
            let resData = await RefreshTokenHandler.rpByRef({
                method: 'delete',
                uri: API_SERVER + V360_DEL_ADMIN + req.params.mp4key,
                headers: ReqTkHandle.tokenMed(req),
                json: true,
            }, req)
            log(API_SERVER + V360_DEL_ADMIN + req.params.mp4key)
            res.json({
                result: true,
                data: req.params.mp4key,
            })
        } catch (err) {
            loge(API_SERVER + V360_DEL_ADMIN + req.params.mp4key, ReqTkHandle.loge(err))
            res.json(ReqTkHandle.errRes(err))
        }
    })

    /* v360 meta */
    app.get(V360_META_API + ':mp4key', async function(req, res) {
        log(V360_META_API + ' =>', req.params.mp4key)
        try {
            let resData = await RefreshTokenHandler.rpByRef({
                method: 'GET',
                uri: API_SERVER + V360_META_ADMIN + req.params.mp4key,
                headers: ReqTkHandle.tokenMed(req),
                json: true,
            }, req)
            log(V360_META_API, ' =>', resData.data)
            res.json({
                result: true,
                data: resData,
            })
        } catch (err) {
            loge(API_SERVER + V360_META_ADMIN + req.params.mp4key, ReqTkHandle.loge(err))
            res.json(ReqTkHandle.errRes(err))
        }
    })

    /* 取得V360檔案 */
    app.get(V360_FP_API + ':mp4key', async function(req, res) {
        let mp4key = req.params.mp4key;
        log(V360_FP_API + mp4key)
        try {
            await RefreshTokenHandler.rpByRef({
                method: 'GET',
                url: API_SERVER + V360_FP_ADMIN + mp4key,
                headers: ReqTkHandle.tokenMed(req),
                json: true,
            }, req, res)
        } catch (err) {
            loge(API_SERVER + V360_FP_ADMIN + mp4key, ReqTkHandle.loge(err))
            res.status(err.statusCode).send(ReqTkHandle.loge(err))
        }
    })
}

/* 送出h360轉360 */
function h360ToV360(v360Obj) {
    log('V360_MANAGER =>', V360_MANAGER)
    log('h360ToV360 =>', v360Obj)
    return new Promise((resolve, reject) => {
        rp({
            method: 'POST',
            uri: V360_MANAGER + '/h360/mp4',
            body: v360Obj,
            json: true,
        }).then((res) => {
            log('h360ToV360 =>', 'res..', res)
            resolve(res)
        }).catch((err) => {
            loge('h360ToV360 =>', ReqTkHandle.loge(err))
            reject(err)
        })
    })
}
