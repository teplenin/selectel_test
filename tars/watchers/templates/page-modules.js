var gulp = require('gulp');
var chokidar = require('chokidar');
var tarsConfig = require('../../../tars-config');
var watcherLog = require('../../helpers/watcher-log');

/**
 * Watcher for templates-files of modules and pages
 * @param  {Object} watchOptions
 */
module.exports = function (watchOptions) {
    return chokidar.watch([
            'markup/pages/**/*.html',
            'markup/modules/**/*.html'
        ], {
            ignored: '',
            persistent: true,
            ignoreInitial: true
        }).on('all', function (event, path) {
            watcherLog(event, path);
            gulp.start('html:compile-templates');
        });
};