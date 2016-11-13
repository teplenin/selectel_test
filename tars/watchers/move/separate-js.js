var gulp = require('gulp');
var chokidar = require('chokidar');
var tarsConfig = require('../../../tars-config');
var watcherLog = require('../../helpers/watcher-log');

/**
 * Watcher for separate Js files files
  */
module.exports = function () {
    return chokidar.watch('markup/' + tarsConfig.fs.staticFolderName + '/js/separate-js/**/*.js', {
        ignored: '',
        persistent: true,
        ignoreInitial: true
    }).on('all', function (event, path) {
        watcherLog(event, path);
        gulp.start('js:move-separate');
    });
};