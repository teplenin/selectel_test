var gulp = require('gulp');
var gutil = require('gulp-util');
var chokidar = require('chokidar');
var tarsConfig = require('../../../tars-config');
var watcherLog = require('../../helpers/watcher-log');

/**
 * Watcher for common scss(less or stylus)-files and scss(less or stylus)-files of plugins
 * @param  {Object} watchOptions
 */
module.exports = function (watchOptions) {
    console.log(watchOptions.cssPreprocExtension);
    return chokidar.watch([
            'markup/' + tarsConfig.fs.staticFolderName + '/scss/**/*.scss',
            'markup/' + tarsConfig.fs.staticFolderName + '/scss/**/*.css'
        ], {
            ignored: '',
            persistent: true,
            ignoreInitial: true
        }).on('all', function (event, path) {
            watcherLog(event, path);
            gulp.start('css:compile-css');
        });
};