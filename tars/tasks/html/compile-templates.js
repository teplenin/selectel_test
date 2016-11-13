var gulp = require('gulp');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var tarsConfig = require('../../../tars-config');
var replace = require('gulp-replace-task');
var notifier = require('../../helpers/notifier');
var browserSync = require('browser-sync');
var fs = require('fs');
var handlebars = require('gulp-compile-handlebars');
var through2 = require('through2');

var handlebarsOptions = {
        batch: ['./markup/modules'],
        helpers: require('../../helpers/handlebars-helpers')
    };

/**
 * Handlebars compilation of pages templates.
 * Templates with _ prefix won't be compiled
 * @param  {Object} buildOptions
 */
module.exports = function (buildOptions) {

    function concatModulesData() {
        var dataEntry,
            readyModulesData;

        try {
            dataEntry = fs.readFileSync('./dev/temp/modulesData.js', 'utf8');
        } catch (er) {
            dataEntry = false;
        }

        if (dataEntry) {
            eval('readyModulesData = {' + dataEntry + '}');
        } else {
            readyModulesData = '{}';
        }

        return readyModulesData;
    }

    var patterns = [];

    if (gutil.env.min) {
        patterns.push(
            {
                match: '%=min=%',
                replacement: '.min'
            }
        );
    } else {
        patterns.push(
            {
                match: '%=min=%',
                replacement: ''
            }
        );
    }

    patterns.push(
        {
            match: '%=staticPrefix=%',
            replacement: tarsConfig.staticPrefix
        }
    );

    return gulp.task('html:compile-templates', function (cb) {
        var modulesData, error;

        try {
            modulesData = concatModulesData();
        } catch (er) {
            error = er;
            modulesData = false;
        }

        return gulp.src(['./markup/pages/**/*.html', '!./markup/pages/**/_*.html'])
            .pipe(
                modulesData
                    ? handlebars(modulesData, handlebarsOptions)
                    : through2.obj(
                        function () {
                            console.log(gutil.colors.red('An error occurred with data-files!'));
                            this.emit('error', error);
                        }
                    )
            )
            .on('error', notify.onError(function (error) {
                return '\nAn error occurred while compiling handlebars.\nLook in the console for details.\n' + error;
            }))
            .on('error', function () {
                this.emit('end');
            })
            .pipe(replace({
                patterns: patterns,
                usePrefix: false
            }))
            .on('error', notify.onError(function (error) {
                return '\nAn error occurred while replacing placeholdres.\nLook in the console for details.\n' + error;
            }))
            .pipe(gulp.dest('./dev/'))
            .pipe(browserSync.reload({ stream: true }))
            .pipe(
                notifier('Templates\'ve been compiled')
            );
    });
};