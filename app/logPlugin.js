const log4js = require('log4js')
const logLv = process.env.NODE_ENV === 'production' ? 'info' : 'trace'
module.exports = {
    init(config) {
        if (!config) {
            config = {
                appenders: [{
                    type: 'console'
                }, ],
            }
        }
        [
            'app',
            'fileApi',
            'h360Api',
            'h360DetailApi',
            'io',
            'r360Api',
            'refreshTokenHandler',
            'signApi',
            'v360Api',
        ].map((key) => {
            config.appenders.push({
                type: 'file',
                filename: 'logs/' + key,
                maxLogSize: 20480,
                backups: 3,
                category: key,
            })
        })
        log4js.configure(config)
        this.setLogLv()
    },
    setLogLv(log, lv) {
        log = log ? log : 'log'
        lv = lv ? lv : logLv
        this[log] = log4js.getLogger(log)
        this[log].setLevel(lv)
    },
    getLog(log) {
        log = log ? log : 'log'
        const logger = this[log]
        return logger.trace.bind(logger)
    },
    getDebug(log) {
        log = log ? log : 'log'
        const logger = this[log]
        return logger.debug.bind(logger)
    },
    getInfo(log) {
        log = log ? log : 'log'
        const logger = this[log]
        return logger.info.bind(logger)
    },
    getWarn(log) {
        log = log ? log : 'log'
        const logger = this[log]
        return logger.warn.bind(logger)
    },
    getError(log) {
        log = log ? log : 'log'
        const logger = this[log]
        return logger.error.bind(logger)
    },
    getFatal(log) {
        log = log ? log : 'log'
        const logger = this[log]
        return logger.fatal.bind(logger)
    },
}
