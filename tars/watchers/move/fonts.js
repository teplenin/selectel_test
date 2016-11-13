var gulp = require('gulp');
var chokidar = require('chokidar');
var tarsConfig = require('../../../tars-config');
var watcherLog = require('../../helpers/watcher-log');

/**
 * Watcher for font files
 */
module.exports = function () {
    return chokidar.watch('markup/' + tarsConfig.fs.staticFolderName + '/fonts/**/*.*', {
        ignored: '',
        persistent: true,
        ignoreInitial: true
    }).on('all', function (event, path) {
        watcherLog(event, path);
        gulp.start('other:move-fonts');
    });
};