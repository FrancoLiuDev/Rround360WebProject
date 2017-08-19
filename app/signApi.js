//     __    ____  ___________   __
//    / /   / __ \/ ____/  _/ | / /
//   / /   / / / / / __ / //  |/ /
//  / /___/ /_/ / /_/ // // /|  /
// /_____/\____/\____/___/_/ |_/
// 

/**
 * @file
 * 登入API
 */

const request = require('request');
const logPluin = require('./logPlugin.js')
const LOGME = 'signApi'
logPluin.setLogLv(LOGME)
const log = logPluin.getLog(LOGME)
const loge = logPluin.getError(LOGME)
const ToolsKit = require('./toolskit.js');
const config = require('../config.json');
const API_SERVER = process.env.API_PORT_18000_TCP_ADDR ?
    "http://" + process.env.API_PORT_18000_TCP_ADDR + ":" + process.env.API_PORT_18000_TCP_PORT : config.API_SERVER;
const ReqTkHandle = require('./reqTkHandle.js')
const RefreshTokenHandler = require('./refreshTokenHandler.js')
const LOGIN_API = config.API.login.name
const LOGOUT_API = config.API.logout.name
const CHKTEN_API = config.API.chkTaken.name
const UID = config.API.login.uid;
const UPS = config.API.login.ups;
const ADMIN_USER_LOGIN_API = API_SERVER + config.API.login.admin_api
const ADMIN_USER_LOOUT_API = API_SERVER + config.API.logout.admin_api
const ADMIN_USER_CHKTEN_API = API_SERVER + config.API.chkTaken.admin_api
const ADMIN_USER_LOGIN_KEY = config.API.login.key
const K_BRAND = process.env.K_BRANK ? process.env.K_BRANK : config.API.login.brand

module.exports = signApi

/**
 * 登入API
 * @constructor
 * @param  {Object} app Express.app
 */
function signApi(app) {
    log('sigin api init!!');
    log('ADMIN_USER_LOGIN_API : ' + ADMIN_USER_LOGIN_API)

    //是否有登入紀錄 k-session
    app.get(CHKTEN_API, (req, res) => {
        log(ADMIN_USER_CHKTEN_API, req.session['k-user'])
        if (!req.session['k-session']) {
            res.json({
                result: false,
            })
            return
        }
        request.post({
            url: ADMIN_USER_CHKTEN_API,
            headers: ReqTkHandle.tokenMed(req),
        }, (err, httpResponse) => {
            if (err) {
                loge(ADMIN_USER_CHKTEN_API, err)
                res.status(500).json(err)
            } else {
                let statusCode = httpResponse.toJSON().statusCode
                if (statusCode === 204) {
                    res.json({
                        result: true,
                    })
                } else {
                    log(ADMIN_USER_CHKTEN_API, statusCode, httpResponse.toJSON().headers.code)
                    if (RefreshTokenHandler.isTonkenNeedRefHttpResponse(httpResponse)) {
                        RefreshTokenHandler.refreshTokenSys(req)
                            .then(data => {
                                req.session['k-session'] = data.session
                                req.session['rsession'] = data.rsession
                                res.json({
                                    result: true,
                                })
                            })
                            .catch(err => {
                                req.session['k-session'] = ''
                                req.session['k-user'] = ''
                                req.session['rsession'] = ''
                                res.json(ReqTkHandle.errRes(err))
                            })
                    } else {
                        res.json({
                            result: false,
                            statusCode: statusCode,
                            code: httpResponse.toJSON().headers.code,
                        })
                    }
                }
            }
        })
    })

    //登出
    app.get(LOGOUT_API, (req, res) => {
        log(ADMIN_USER_LOOUT_API, req.session['k-user'])
        request.post({
            url: ADMIN_USER_LOOUT_API,
            headers: ReqTkHandle.tokenMed(req),
            form: {
                rsession: req.session['rsession'],
            },
        }, (err, httpResponse) => {
            if (err) {
                loge(ADMIN_USER_LOOUT_API, err)
                res.status(500).json(err)
            } else {
                let statusCode = httpResponse.toJSON().statusCode
                if (statusCode === 204) {
                    log(LOGOUT_API, req.session['k-user'])
                    req.session['k-session'] = ''
                    req.session['k-user'] = ''
                    req.session['rsession'] = ''
                    res.json({
                        result: true,
                    })
                } else {
                    loge(ADMIN_USER_LOOUT_API, statusCode, httpResponse.toJSON().headers.code)
                    req.session['k-session'] = ''
                    req.session['k-user'] = ''
                    req.session['rsession'] = ''
                    res.json({
                        result: true,
                    })
                }
            }
        })
    })

    /**
     * login api
     */
    app.post(LOGIN_API, function(req, res) {
        request.post({
            url: ADMIN_USER_LOGIN_API,
            headers: ReqTkHandle.tokenMed(),
            form: {
                user: req.body[UID],
                pwd: ToolsKit.getEncrypt(req.body[UPS], ADMIN_USER_LOGIN_KEY),
                brand: K_BRAND,
            }
        }, function(err, httpResponse, body) {
            if (err) {
                log('login error!!', err);
                req.session['k-session'] = '';
                res.status(500).json(err);
            } else {
                let statusCode = httpResponse.toJSON().statusCode
                if (statusCode === 200) {
                    log(req.body[UID] + ' login !!')
                    let data = JSON.parse(body).data
                    req.session['k-session'] = data.session
                    req.session['k-user'] = req.body[UID]
                    req.session['rsession'] = data.rsession
                    res.json({
                        result: true,
                    })
                } else {
                    req.session['k-session'] = ''
                    req.session['rsession'] = ''
                    res.json({
                        result: false,
                        statusCode: statusCode,
                        code: httpResponse.toJSON().headers.code,
                    })
                }
            }
        })
    })
}
