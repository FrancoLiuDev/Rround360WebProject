/**
 * @file
 * 編譯替換變數 Compile replacement variables
 */

/* config */
const config = require('./config.json')
    /* Web Sevice */
const SERVER = config.SERVER
    /* R360列表每次載入幾筆 */
const R360_LIST_MAX = '10'
const LOGIN_API = config.API.login.name
const LOOUT_API = config.API.logout.name
const CHKTEN_API = config.API.chkTaken.name
const R360_LIST_API = config.API.r360List.name
const R360_PAG_API = config.API.r360pag.name
const R360_BASE_PATH = config.API.r360pag.basePath
const V360_LIST_API = config.API.v360List.name
const V360_DEL_API = config.API.v360Del.name
const V360_META_API = config.API.v360Meta.name
const V360_FP_API = config.API.v360Fp.name
module.exports = {
    'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    },
    ENV_SERVER: JSON.stringify(process.env.SERVER || SERVER),
    ENV_R360_LIST_MAX: JSON.stringify(process.env.R360_LIST_MAX || R360_LIST_MAX),
    ENV_LOGIN_API: JSON.stringify(LOGIN_API),
    ENV_LOOUT_API: JSON.stringify(LOOUT_API),
    ENV_CHKTEN_API: JSON.stringify(CHKTEN_API),
    ENV_R360_LIST_API: JSON.stringify(R360_LIST_API),
    ENV_R360_PAG_API: JSON.stringify(R360_PAG_API),
    ENV_R360_BASE_PATH: JSON.stringify(R360_BASE_PATH),
    ENV_V360_LIST_API: JSON.stringify(V360_LIST_API),
    ENV_V360_DEL_API: JSON.stringify(V360_DEL_API),
    ENV_V360_META_API: JSON.stringify(V360_META_API),
    ENV_V360_FP_API: JSON.stringify(V360_FP_API),
}
