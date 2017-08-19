require('should');
const path = require('path');
const request = require('request-promise');
const fs = require('fs');
const config = require(path.join(__dirname, '..', 'config.json'));
// let ddd = 'http://127.0.0.1/sigin/login';
const TEST_SERVER = 'http://127.0.0.1';
//login api test
describe('login api,', function() {
    it(TEST_SERVER + config.API.login.name, function(done) {
        request({
            method: 'POST',
            uri: TEST_SERVER + config.API.login.name,
            body: {
                uid: 'leedian',
                ups: '81dc9bdb52d04dc20036dbd8313ed055',
            },
            json: true,
            jar: true,
        }).then((res) => {
            res.should.have.not.keys('statusCode');
            res.result.should.be.equal(true);
            return done();
        }).catch((err) => {
            return done(err);
        })
    });
});

//列表測試
describe('h360 list api,', function() {
    it(TEST_SERVER + config.API.h360List.name, function(done) {
        request({
            method: 'POST',
            uri: TEST_SERVER + config.API.h360List.name,
            json: true,
            jar: true,
        }).then((res) => {
            res.should.have.keys('result');
            res.result.should.be.equal(true);
            res.should.have.keys('data');
            return done();
        }).catch((err) => {
            return done(err);
        });
    });
});

//H360資訊API
describe('h360 detail api,', function() {
    //h360 Meta API 測試
    it(TEST_SERVER + config.API.h360detail.name + 'leedian1483079127124zip', function(done) {
        request({
            method: 'GET',
            uri: TEST_SERVER + config.API.h360detail.name + 'leedian1483079127124zip',
            json: true,
            jar: true,
        }).then((res) => {
            res.should.have.keys('result');
            res.result.should.be.equal(true);
            res.should.have.keys('data');
            return done();
        }).catch((err) => {
            return done(err);
        });
    })

    //h360 修改 meta 測試
    it(TEST_SERVER + config.API.h360detail_edit.name + 'leedian1483079127124zip', function(done) {
        request({
            method: 'POST',
            uri: TEST_SERVER + config.API.h360detail_edit.name + 'leedian1483079127124zip',
            json: true,
            jar: true,
            body: {
                name: '鐘錶展示【勿動】',
            },
        }).then((res) => {
            res.should.have.keys('result');
            res.result.should.be.equal(true);
            return done();
        }).catch((err) => {
            return done(err);
        });
    })
})

//檔案下載API
describe('file api,', function() {
    it(TEST_SERVER + config.API.fp.name + 'leedian1483079127124', function(done) {
        const file = fs.createWriteStream('tmp.jpg');
        request.get({
            // url: TEST_SERVER + config.API.fp.name + 'leedian1483079127124',
            url: 'http://60.251.125.208:18000/api/v1/r360/fp/leedian1484551873719zip',
            jar: true,
        }).on('error', function(err) {
            return done(err);
        }).on('end', function() {
            let stats = fs.statSync('tmp.jpg');
            if (stats.size === 0) { //沒有檔案
                return done('size = 0');
            } else {
                return done();
            }
        }).pipe(file);
    });

    it(TEST_SERVER + '/ck/leedian1483079127124', function(done) {
        request.get({
            url: TEST_SERVER + '/ck/leedian1483079127124zip',
            json: true,
            jar: true,
        }).then((res) => {
            res.should.have.keys('result');
            res.result.should.be.equal(true);
            res.should.have.keys('path');
            res.path.should.be.equal('/leedian1483079127124zip/131275522693433013/');
            return done();
        }).catch((err) => {
            return done(err);
        });
    }).timeout(30000);
});


//r360 API
describe('r360 api,', () => {
    it(TEST_SERVER + config.API.r360List.name, (done) => {
        request({
            method: 'POST',
            baseUrl: TEST_SERVER,
            uri: config.API.r360List.name,
            json: true,
            jar: true,
        }).then((res) => {
            res.should.have.keys('result');
            res.result.should.be.equal(true);
            return done();
        }).catch((err) => {
            return done(err);
        })
    })

    it(TEST_SERVER + config.API.r360pag.name + 'R360_leedian1489567990109zip', (done) => {
        request({
            method: 'GET',
            baseUrl: TEST_SERVER,
            uri: config.API.r360pag.name + 'R360_leedian1489567990109zip',
            json: true,
            jar: true,
        }).then((res) => {
            res.should.have.keys('result');
            res.result.should.be.equal(true);
            return done();
        }).catch((err) => {
            return done(err);
        })
    }).timeout(30000);
})
