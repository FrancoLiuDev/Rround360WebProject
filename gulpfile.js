var gulp = require('gulp');
var jsdoc = require('leedian-jsdoc');

gulp.task('doc:ser', function(cb) {
    var config = require('./build/conf_ser.json');
    gulp.src([
            './README.md',
            './app/*',
        ], { read: false })
        .pipe(jsdoc(config, cb));
});

gulp.task('doc:web', function(cb) {
    var config = require('./build/conf_web.json');
    gulp.src([
            './README.md',
            './src/*',
        ], { read: false })
        .pipe(jsdoc(config, cb));
});

gulp.task('doc', ['doc:ser', 'doc:web']);
