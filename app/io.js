const logPluin = require('./logPlugin.js')
const LOGME = 'io'
logPluin.setLogLv(LOGME)
const log = logPluin.getLog(LOGME)
const SocketIo = require('socket.io');
class PushServer {
    constructor(server) {
        this.io = SocketIo(server);
        this.io.on('connection', socket => {
            socket.join('mp4')
            log('connection');
        });
    }

    emit(data) {
        log(data);
        this.io.to('mp4').emit("data", data);
    }
}

module.exports = PushServer;
