/**
 * @file
 * H360列表操作API<br>刪除H360 API
 */
const logPluin = require('./logPlugin.js')
const LOGME = 'h360Api'
logPluin.setLogLv(LOGME)
const log = logPluin.getLog(LOGME)
const RefreshTokenHandler = require('./refreshTokenHandler.js')
const config = require('../config.json');
const ReqTkHandle = require('./reqTkHandle.js');
const API_SERVER = process.env.API_PORT_18000_TCP_ADDR ?
    "http://" + process.env.API_PORT_18000_TCP_ADDR + ":" + process.env.API_PORT_18000_TCP_PORT : config.API_SERVER;
const LIST_API = config.API.h360List.name;
const ADMIN_LIST_API = API_SERVER + config.API.h360List.admin_api;
const DEL_API = config.API.h360Del.name;
const ADMIN_DEL_API = API_SERVER + config.API.h360Del.admin_api;

module.exports = h360Api;

/**
 * 列表操作API<br>刪除物件API
 * @constructor
 * @param  {Object} app Express.app
 */
function h360Api(app) {
    log('h360 list api init!!');
    /* get list api */
    app.post(LIST_API, async function(req, res) {
        let limit = 50;
        let offset = 0;
        let sort = 'desc';
        if (req.body) {
            limit = req.body.limit ? req.body.limit : limit;
            offset = req.body.offset ? req.body.offset : offset;
            sort = req.body.sort ? req.body.sort : sort;
        }
        let url = ADMIN_LIST_API + '?limit=' + limit + '&offset=' + offset + '&sort=' + sort;
        log(url)
        try {
            let resData = await RefreshTokenHandler.rpByRef({
                url: url,
                headers: ReqTkHandle.tokenMed(req),
                method: 'GET',
                json: true,
            }, req)
            res.json({
                result: true,
                data: resData,
            });
        } catch (err) {
            res.json(ReqTkHandle.errRes(err))
        }
    });

    /* delete item api */
    app.get(DEL_API + ':zipkey', async function(req, res) {
        let zipkey = req.params.zipkey;
        log(ADMIN_DEL_API + zipkey)
        try {
            await RefreshTokenHandler.rpByRef({
                method: 'delete',
                url: ADMIN_DEL_API + zipkey,
                json: true,
                headers: ReqTkHandle.tokenMed(req),
                body: { status: 1 },
            }, req)
            res.json({ result: true })
        } catch (err) {
            res.json(ReqTkHandle.errRes(err))
        }
    });
}
