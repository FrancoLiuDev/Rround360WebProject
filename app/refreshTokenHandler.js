/**
 * @file 
 * Token 交換功能
 */
const logPluin = require('./logPlugin.js')
const LOGME = 'refreshTokenHandler'
logPluin.setLogLv(LOGME)
const log = logPluin.getLog(LOGME)
const rp = require('request-promise')
const config = require('../config.json')
const ReqTkHandle = require('./reqTkHandle.js')
const API_SERVER = process.env.API_PORT_18000_TCP_ADDR ?
    "http://" + process.env.API_PORT_18000_TCP_ADDR + ":" + process.env.API_PORT_18000_TCP_PORT : config.API_SERVER
const RELOG_ADMIN_API = API_SERVER + config.API.refToken.admin_api
const ADMIN_USER_LOGIN_K_TOKEN = config.API.login.ktoken
module.exports = {
    _refresh(req) {
        return rp({
            method: 'POST',
            uri: RELOG_ADMIN_API,
            body: {
                session: req.session['k-session'],
                rsession: req.session['rsession'],
                token: ADMIN_USER_LOGIN_K_TOKEN,
            },
            json: true,
        })
    },
    /* Token交換 */
    async refreshTokenSys(req) {
        return new Promise((resolve, reject) => {
            log(RELOG_ADMIN_API)
            this._refresh(req)
                .then(res => {
                    req.session['k-session'] = res.data.session
                    req.session['rsession'] = res.data.rsession
                    resolve()
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    /* 是否為過期錯誤 */
    isTonkenNeedRef(err) {
        // return err.toJSON().headers.code === '01.003' ? true : false
        return err.response.headers.code === '01.003' ? true : false
    },
    isTonkenNeedRefHttpResponse(httpResponse) {
        // return err.toJSON().headers.code === '01.003' ? true : false
        return httpResponse.headers.code === '01.003' ? true : false
    },
    /* rp通訊含token交換機制 */
    rpByRef(body, req, pipeRes) {
        let self = this
        return new Promise(async function(resolve, reject) {
            try {
                let res = pipeRes ? await rp(body).pipe(pipeRes) : await rp(body)
                resolve(res)
            } catch (err) {
                if (self.isTonkenNeedRef(err)) {
                    try {
                        let refRes = await self.refreshTokenSys(req)
                        req.session['k-session'] = refRes.session
                        req.session['rsession'] = refRes.rsession
                        body.headers = ReqTkHandle.tokenMed(req)
                        let res = await rp(body)
                        resolve(res)
                    } catch (err) {
                        reject(err)
                    }
                } else {
                    reject(err)
                }
            }
        })
    }
}
