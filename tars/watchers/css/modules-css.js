var gulp = require('gulp');
var gutil = require('gulp-util');
var chokidar = require('chokidar');
var watcherLog = require('../../helpers/watcher-log');

/**
 * Watch for modules' css-files
 * @param  {Object} watchOptions
 */
module.exports = function (watchOptions) {
    return chokidar.watch('markup/modules/**/*.scss', {
        ignored: '',
        persistent: true,
        ignoreInitial: true
    }).on('all', function (event, path) {
        watcherLog(event, path);
        gulp.start('css:compile-css');
    });
};