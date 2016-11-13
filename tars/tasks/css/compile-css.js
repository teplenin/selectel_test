var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var autoprefixer = require('gulp-autoprefixer');
var replace = require('gulp-replace-task');
var addsrc = require('gulp-add-src');
var notify = require('gulp-notify');
var tarsConfig = require('../../../tars-config');
var notifier = require('../../helpers/notifier');
var browserSync = require('browser-sync');

var useAutoprefixer = false;
var helperStream;
var mainStream;
// var ie9Stream;
// var ie8Stream;

if (tarsConfig.autoprefixerConfig) {
    useAutoprefixer = true;
}

var scssFilesToConcatinate = [
        './markup/' + tarsConfig.fs.staticFolderName + '/scss/libraries/**/*.scss',
        './markup/' + tarsConfig.fs.staticFolderName + '/scss/libraries/**/*.css',
        './markup/' + tarsConfig.fs.staticFolderName + '/scss/mixins.scss',
        './markup/' + tarsConfig.fs.staticFolderName + '/scss/sprites-scss/sprite_96.scss'
    ];

scssFilesToConcatinate.push(
    './markup/' + tarsConfig.fs.staticFolderName + '/scss/fonts.scss',
    './markup/' + tarsConfig.fs.staticFolderName + '/scss/vars.scss',
    './markup/' + tarsConfig.fs.staticFolderName + '/scss/GUI.scss',
    './markup/' + tarsConfig.fs.staticFolderName + '/scss/common.scss',
    './markup/' + tarsConfig.fs.staticFolderName + '/scss/plugins/**/*.scss',
    './markup/' + tarsConfig.fs.staticFolderName + '/scss/plugins/**/*.css',
    './markup/modules/*/*.scss'
);

/**
 * Scss compilation
 * @param  {object} buildOptions
 */
module.exports = function (buildOptions) {

    var patterns = [];

    patterns.push(
        {
            match: '%=staticPrefixForCss=%',
            replacement: tarsConfig.staticPrefixForCss()
        }
    );

    return gulp.task('css:compile-css', function () {

        helperStream = gulp.src(scssFilesToConcatinate);

        // ie9Stream = helperStream.pipe(
        //                 addsrc.append([
        //                     './markup/modules/*/ie/ie9.scss'
        //                 ])
        //             );

        // ie8Stream = helperStream.pipe(
        //                 addsrc.append([
        //                     './markup/modules/*/ie/ie8.scss'
        //                 ])
        //             );

        return mainStream = helperStream.pipe(concat('main.css'))
            .pipe(replace({
                patterns: patterns,
                usePrefix: false
            }))
            .pipe(sass({
                    errLogToConsole: false,
                    onError: function (error) {
                        notify().write('\nAn error occurred while compiling css.\nLook in the console for details.\n');
                        return gutil.log(gutil.colors.red(error.message + ' on line ' + error.line + ' in ' + error.file));
                    }
                }))
            .pipe(
                gulpif(useAutoprefixer,
                    autoprefixer(
                        {
                            browsers: tarsConfig.autoprefixerConfig,
                            cascade: true
                        }
                    )
                )
            )
            .on('error', notify.onError(function (error) {
                return '\nAn error occurred while autoprefixing css.\nLook in the console for details.\n' + error;
            }))
            .pipe(gulp.dest('./dev/' + tarsConfig.fs.staticFolderName + '/css/'))
            .pipe(browserSync.reload({ stream: true }))
            .pipe(
                notifier('Scss-files\'ve been compiled')
            );

        // ie9Stream
        //     .pipe(concat('main_ie9.css'))
        //     .pipe(replace({
        //         patterns: patterns,
        //         usePrefix: false
        //     }))
        //     .pipe(sass({
        //         errLogToConsole: false,
        //         onError: function (error) {
        //             notify().write('\nAn error occurred while compiling css for ie9.\nLook in the console for details.\n');
        //             return gutil.log(gutil.colors.red(error.message + ' on line ' + error.line + ' in ' + error.file));
        //         }
        //     }))
        //     .pipe(autoprefixer('ie 9', { cascade: true }))
        //     .on('error', notify.onError(function (error) {
        //         return '\nAn error occurred while autoprefixing css.\nLook in the console for details.\n' + error;
        //     }))
        //     .pipe(gulp.dest('./dev/' + tarsConfig.fs.staticFolderName + '/css/'))
        //     .pipe(browserSync.reload({ stream: true }))
        //     .pipe(
        //         notifier('Css-files for ie9 have been compiled')
        //     );

        // return ie8Stream
        //     .pipe(concat('main_ie8.css'))
        //     .pipe(replace({
        //         patterns: patterns,
        //         usePrefix: false
        //     }))
        //     .pipe(sass({
        //         errLogToConsole: false,
        //         onError: function (error) {
        //             notify().write('\nAn error occurred while compiling css for ie8.\nLook in the console for details.\n');
        //             return gutil.log(gutil.colors.red(error.message + ' on line ' + error.line + ' in ' + error.file));
        //         }
        //     }))
        //     .pipe(autoprefixer('ie 8', { cascade: true }))
        //     .on('error', notify.onError(function (error) {
        //         return '\nAn error occurred while autoprefixing css.\nLook in the console for details.\n' + error;
        //     }))
        //     .pipe(gulp.dest('./dev/' + tarsConfig.fs.staticFolderName + '/css/'))
        //     .pipe(browserSync.reload({ stream: true }))
        //     .pipe(
        //         notifier('Css-files for ie8 have been compiled')
        //     );
    });
};