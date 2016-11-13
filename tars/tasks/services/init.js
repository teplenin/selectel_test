var gulp = require('gulp');
var tarsConfig = require('../../../tars-config');
var gutil = require('gulp-util');
var ncp = require('ncp').ncp;
var os = require('os');

ncp.limit = 16;
require('./create-fs')();

/**
 * Init builder, download css-preprocessor and templater
 * @param  {Object} buildOptions
 */
module.exports = function(buildOptions) {

    return gulp.task('service:init', ['service:create-fs'], function(cb) {

        /* INIT Script */

    });
};