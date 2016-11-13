var gulp = require('gulp');
var gutil = require('gulp-util');

/**
 * Output in the begining
 * @param  {object} buildOptions
 */
module.exports = function (buildOptions) {
    return gulp.task('service:builder-start-screen', function (cb) {
        var i = 0;

        console.log('\n------------------------------------------------------------');
        console.log(gutil.colors.green.bold('Build have been started. You are using:\n'));

        if (gutil.env.tunnel) {
            console.log(gutil.colors.black.bold('• tunnel mode;'));
        }

        for (var key in gutil.env) { i++; }

        if (i <= 1) {
            console.log(gutil.colors.black.bold('No modes.'));
        }

        console.log(gutil.colors.green.bold('\nHave a nice work.'));
        console.log(gutil.colors.green.bold('Let\'s go & create something awesome!'));

        console.log('------------------------------------------------------------\n');

        cb();
    });
};