//   ______            __        __ __ _ __
//  /_  __/___  ____  / /____   / //_/(_) /_
//   / / / __ \/ __ \/ / ___/  / ,<  / / __/
//  / / / /_/ / /_/ / (__  )  / /| |/ / /_
// /_/  \____/\____/_/____/  /_/ |_/_/\__/
// 

/**
 * @file
 * 工具函示庫
 */

/**
 * @namespace  ToolsKit
 * @classdesc 通用工具函示庫
 */

const crypto = require('crypto');
const useragent = require('useragent');

/**
 * MD5 hex編碼
 * @memberof  ToolsKit
 * @param  {String} string 要編的字串
 * @return {String}        編碼結果
 */
function md5(string) {
    const md5 = crypto.createHash('md5');
    return md5.update(string, 'utf8').digest('hex');
}
exports.md5 = md5;

/**
 * 加密
 * @memberof  ToolsKit
 * @param  {String} str   要加密的字串
 * @param  {String} dsKey key，自己定一個
 * @return {String}       加密結果
 */
function getEncrypt(str, dsKey) {
    const cipher = crypto.createCipheriv('des-ede3', new Buffer(dsKey), new Buffer(0));
    let encrypted = cipher.update(str, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}
exports.getEncrypt = getEncrypt;

/**
 * des-ede3解密
 * @memberof  ToolsKit
 * @param  {String} tkn   要解密的字串
 * @param  {String} dsKey Key
 * @return {String}       解密結果
 */
function decryptTkn(tkn, dsKey) {
    const decipher = crypto.createDecipheriv('des-ede3', new Buffer(dsKey), new Buffer(0));
    let txt = decipher.update(tkn, 'base64', 'utf8');
    txt += decipher.final('utf8');
    return txt.slice(0, 32);
}
exports.decryptTkn = decryptTkn;

/**
 * 檢查裝置類型
 * @memberof  ToolsKit
 * @param  {Object} req express 的 req 物件
 * @return {String}     裝置類型 iphone || ipod || android || desktop
 */
function detectDevice(req) {
    const userAgent = (req.headers['user-agent'] || '').toLowerCase();
    switch (true) {
        case userAgent.indexOf('iphone') !== -1:
            return 'iphone';
        case userAgent.indexOf('ipod') !== -1:
            return 'ipod';
        case userAgent.indexOf('ipad') !== -1:
            return 'ipad';
        case userAgent.indexOf('android') !== -1:
            return 'android';
        default:
            return 'desktop';
    }
}
exports.detectDevice = detectDevice;

/**
 * 檢查是否小於IE8
 * @memberof  ToolsKit
 * @param  {Object}  req express 的 req 物件
 * @return {Boolean}    是否小於IE8 
 */
function isIe8(req) {
    const agent = useragent.is(req.headers['user-agent']);
    return agent.ie && (agent.version * 1 <= 8);
}
exports.isIe8 = isIe8;

/**
 * 取得 user-agent
 * @memberof  ToolsKit
 * @param  {Object} req express 的 req 物件
 * @return {Object}     useragent 物件
 */
function useragentList(req) {
    const agent = useragent.is(req.headers['user-agent']);
    return agent;
}
exports.useragentList = useragentList;

/**
 * 取得時間
 * @memberof  ToolsKit
 * @param  {number} shiftDay 與今天差距的時間，例如 1 代表明天
 * @return {String}          格式化的時間 yyyy-mm-dd
 */
function getToday(shiftDay) {
    if (shiftDay === void 0) { shiftDay = 0; }
    let now = new Date();
    if (shiftDay !== 0) {
        now.setDate(now.getDate() + shiftDay);
    }
    return getDay(now);
}
exports.getToday = getToday;

/**
 * 時間格式化
 * @memberof  ToolsKit
 * @param  {Date} date new Date() 物件
 * @return {String}      格式化的時間 yyyy-mm-dd
 */
function getDay(date) {
    return date.getFullYear() + "-" + (date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
}
exports.getDay = getDay;

/**
 * Base64 Image 轉 Buffer
 * @memberof  ToolsKit
 * @param  {String} base64Str Base64圖檔字串
 * @return {Buffer} Buffer
 */
function base64ImagsToBuffer(base64Str) {
    return imageBuffer = Buffer.from(base64Str.replace(/^data:image\/\w+;base64,/, ""), 'base64')
}
exports.base64ImagsToBuffer = base64ImagsToBuffer
