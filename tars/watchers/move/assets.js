var gulp = require('gulp');
var chokidar = require('chokidar');
var watcherLog = require('../../helpers/watcher-log');

/**
 * Watcher for images in assets dir of modules
 */
module.exports = function () {
    return chokidar.watch('markup/modules/**/assets/*.*', {
        ignored: '',
        persistent: true,
        ignoreInitial: true
    }).on('all', function (event, path) {
        watcherLog(event, path);
        gulp.start('other:move-assets');
    });
};