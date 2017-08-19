/**
 * @file
 * 查詢與修改物件 API
 */
const logPluin = require('./logPlugin.js')
const LOGME = 'h360DetailApi'
logPluin.setLogLv(LOGME)
const log = logPluin.getLog(LOGME)
const loge = logPluin.getError(LOGME)
const RefreshTokenHandler = require('./refreshTokenHandler.js')
const config = require('../config.json');
const ReqTkHandle = require('./reqTkHandle.js');
const API_SERVER = process.env.API_PORT_18000_TCP_ADDR ?
    "http://" + process.env.API_PORT_18000_TCP_ADDR + ":" + process.env.API_PORT_18000_TCP_PORT : config.API_SERVER;
const API_DETAIL = config.API.h360detail.name;
const ADMIN_DETAIL = API_SERVER + config.API.h360detail.admin_api;
const API_DETAIL_EDIT = config.API.h360detail_edit.name;
const ADMIN_DETAIL_EDIT = API_SERVER + config.API.h360detail_edit.admin_api;

module.exports = h360DetailApi;

/**
 * 查詢與修改物件 API
 * @constructor
 * @param  {Object} app Express.app
 */
function h360DetailApi(app) {
    log('h360 detail api init!!');
    /* 查詢物件mate */
    app.get(API_DETAIL + ':zipkey', async function(req, res) {
        let zipkey = req.params.zipkey;
        log(ADMIN_DETAIL + zipkey)
        try {
            let resData = await RefreshTokenHandler.rpByRef({
                method: 'GET',
                url: ADMIN_DETAIL + zipkey,
                headers: ReqTkHandle.tokenMed(req),
                json: true,
            }, req)
            res.json({
                result: true,
                data: resData,
            })
        } catch (err) {
            loge(ADMIN_DETAIL + zipkey, ReqTkHandle.loge(err))
            res.json(ReqTkHandle.errRes(err))
        }

    });

    /* 修改物件mate */
    app.post(API_DETAIL_EDIT + ':zipkey', async function(req, res) {
        let zipkey = req.params.zipkey;
        log(ADMIN_DETAIL_EDIT + zipkey, req.body)
        try {
            await RefreshTokenHandler.rpByRef({
                method: 'patch',
                url: ADMIN_DETAIL + zipkey,
                body: req.body,
                headers: ReqTkHandle.tokenMed(req),
                json: true,
            }, req)
            res.json({
                result: true,
            })
        } catch (err) {
            loge(ADMIN_DETAIL_EDIT + zipkey, ReqTkHandle.loge(err))
            res.json(ReqTkHandle.errRes(err));
        }
    });
}
