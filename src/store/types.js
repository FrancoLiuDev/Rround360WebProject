/**
 * @file
 * vuex事件
 */

/**
 * vuex事件
 * @namespace Types
 * @type {Object}
 */

/**
 * 全域載入
 * @memberof Types
 * @type {String}
 */
export const STAGE_LOADING = 'STAGE_LOADING'

/**
 * 輸出訊息
 * @memberof Types
 * @type {String}
 */
export const MESSAGE = 'MESSAGE'

/**
 * 推播訊息
 * @memberof Types
 * @type {String}
 */
export const PUSH_MESSAGE = 'PUSH_MESSAGE'

/**
 * window RESIZE
 * @type {String}
 */
export const RESIZE = 'RESIZE'

//authModules.js======================
/**
 * 是否有登入資料
 * @memberof Types
 * @type {String}
 */
export const HAS_SES = 'HAS_SES';
/**
 * 登入
 * @memberof Types
 * @type {String}
 */
export const LOGIN = 'LOGIN';
/**
 * 登出
 * @memberof Types
 * @type {String}
 */
export const LOGOUT = 'LOGOUT';
/**
 * token過期重新登入
 * @memberof Types
 * @type {String}
 */
export const LOGIN_REP = 'LOGIN_REP';

/**
 * 清除登入的錯誤訊息，藉以消除錯誤顯示
 * memberof Types
 * @type {String}
 */
export const CLEAR_LOGIN_ERROR = 'CLEAR_LOGIN_ERROR'

//h360Modules.js=======================================
/**
 * h360 list每次可載入最多筆數
 * @memberof Types
 * @type {String}
 */
export const H360_LIST_MAX_NUM = '5';
/**
 * 載入h360 list
 * @memberof Types
 * @type {String}
 */
export const H360_LIST = 'H360_LIST';
/**
 * 繼續載入
 * @memberof Types
 * @type {String}
 */
export const H360_LIST_NEXT = 'H360_LIST_NEXT';
/**
 * 刪除H360
 * @memberof Types
 * @type {String}
 */
export const H360_DEL = 'H360_DEL';

/**
 * 變更一個列表中的H360項目內容<br>例如該h360的meta被修改
 * @memberof Types
 * @type {String}
 */
export const CHANGE_H360_ITEM = 'CHANGE_H360_ITEM';
//h360DetailModules.js=======================================
/**
 * h360物件Meta查詢
 * @memberof Types
 * @type {String}
 */
export const H360_META = 'H360_META';
/**
 * h360物件Meta修改
 * @memberof Types
 * @type {String}
 */
export const H360_META_EDIT = 'H360_META_EDIT';

/* r360Modules.js======================================= */
/**
 * R360 List
 * @memberof Types
 * @type {String}
 */
export const R360_LIST = 'R360_LIST';
/**
 * R360 List 繼續載入
 * @memberof Types
 * @type {String}
 */
export const R360_LIST_NEXT = 'R360_LIST_NEXT';
/**
 * 取得R360靜態路徑
 * @memberof Types
 * @type {String}
 */
export const R360_PAG = 'R360_PAG';

/* editV360Modules.js======================================= */

/**
 * 在編輯V360列表中，新增一個H360
 * @memberof Types
 * @type {String}
 */
export const EDIT_V360_ADD = 'EDIT_V360_ADD';

/**
 * 在編輯V360列表中，刪除一個H360
 * @memberof Types
 * @type {String}
 */
export const EDIT_V360_DEL = 'EDIT_V360_DEL'

/**
 * 重置編輯V360列表
 * @memberof Types
 * @type {String}
 */
export const EDIT_V360_CLEAR = 'EDIT_V360_CLEAR'

/**
 * 送出H360Meta
 * @memberof Types
 * @type {String}
 */
export const EDIT_V360_META = 'EDIT_V360_META'

/* v360Modules.js======================================= */

/**
 * 取回V360 list
 * @memberof Types
 * @type {String}
 */
export const V360_LIST = 'V360_LIST'

/**
 * 刪除V360
 * @memberof Types
 * @type {String}
 */
export const V360_DEL = 'V360_DEL'

/**
 * 改變v360影片狀態
 * @memberof Types
 * @type {String}
 */
export const V360_SET_ITEM_STATE = 'V360_SET_ITEM_STATE'

/* v360DetailModules.js======================================= */

export const V360_META = 'V360_META'
