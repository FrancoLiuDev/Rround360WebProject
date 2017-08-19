//                                     __     __                    ____
//    ________  ____ ___  _____  _____/ /_   / /_  ____ _____  ____/ / /__
//   / ___/ _ \/ __ `/ / / / _ \/ ___/ __/  / __ \/ __ `/ __ \/ __  / / _ \
//  / /  /  __/ /_/ / /_/ /  __(__  ) /_   / / / / /_/ / / / / /_/ / /  __/
// /_/   \___/\__, /\__,_/\___/____/\__/  /_/ /_/\__,_/_/ /_/\__,_/_/\___/
//

/**
 * @file
 * 處理 headers 加上 token 等事務
 */

/**
 * @namespace  ReqTkHandle
 * @classdesc 處理 headers 加上 token 等事務
 */

const config = require('../config.json');
/**
 * k-token
 * @memberof  ReqTkHandle
 * @private
 * @type {String}
 */
const ADMIN_USER_LOGIN_K_TOKEN = config.API.login.ktoken;

/**
 * k-brand
 * @memberof  ReqTkHandle
 * @private
 * @type {String}
 */
const K_BRAND = process.env.K_BRANK ? process.env.K_BRANK : config.API.login.brand;

module.exports = {
    /**
     * 處理token
     * @memberof  ReqTkHandle
     * @param  {Object} req req express 的 req 物件
     * @return {Object}     加上 token 後的 headers
     */
    tokenMed(req) {
        return req ? {
            'k-session': req.session['k-session'] || '',
            'k-user': req.session['k-user'] || '',
            'k-brand': K_BRAND,
        } : {
            'k-token': ADMIN_USER_LOGIN_K_TOKEN,
            'k-brand': K_BRAND,
        };
    },
    /**
     * 錯誤訊息
     * @memberof  ReqTkHandle
     * @param  {Object} err        錯誤物件
     * @return {Object}            格式化後的錯誤訊息
     */
    errRes(err) {
        return {
            result: false,
            statusCode: err.statusCode,
            code: err.response.headers.code,
        }
    },
    loge(err) {
        return {
            statusCode: err.statusCode,
            code: err.response.headers.code,
        }
    }
}
