// Using modules
var os = require('os');
var gulp = require('gulp');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');

// Flags
var useTunnelToWeb = gutil.env.tunnel || false,

    // Configs
    tarsConfig = require('./tars-config'),
    browserSyncConfig = tarsConfig.browserSyncConfig,

    buildOptions = {},
    watchOptions = {},

    tasks = [],
    watchers = [];

// Generate build version
if (tarsConfig.useBuildVersioning) {
    buildOptions.buildVersion = require('./tars/helpers/set-build-version')();
    buildOptions.buildPath = tarsConfig.buildPath + 'build' + buildOptions.buildVersion + '/';
} else {
    buildOptions.buildVersion = '';
    buildOptions.buildPath = tarsConfig.buildPath;
}


if (gutil.env.release) {
    buildOptions.hash = Math.random().toString(36).substring(7);
} else {
    buildOptions.hash = '';
}

watchOptions = {
    cssPreprocExtension: 'scss',
    templateExtension: 'html'
};

/***********/
/* HELPERS */
/***********/
// You can add your own helpers here. Helpers folder is tars/helpers

// Set ulimit to 4096 for *nix FS. It needs to work with big amount of files
if (os.platform() !== 'win32') {
    require('./tars/helpers/set-ulimit')();
}

// Load files from dir recursively and synchronously
var fileLoader = require('./tars/helpers/file-loader');

/***************/
/* END HELPERS */
/***************/

/*********/
/* TASKS */
/*********/

// SYSTEM TASKS
tasks = fileLoader('./tars/tasks');

// You could uncomment the row bellow, to see all required tasks in console
// console.log(tasks);

// require tasks
tasks.forEach(function (file) {
    require(file)(buildOptions);
});

/*************/
/* END TASKS */
/*************/

/***********/
/* WATCHERS */
/***********/

// Build dev-version with watchers and livereloader.
// Also could tunnel your markup to web, if you use flag --tunnel
gulp.task('dev', ['build-dev'], function () {

    gulp.start('browsersync');

    // SYSTEM WATCHERS
    watchers = fileLoader('./tars/watchers');

    // You could uncomment the row bellow, to see all required watchers in console
    // console.log(watchers);

    // require watchers
    watchers.forEach(function (file) {
        require(file)(watchOptions);
    });
});

/****************/
/* END WATCHERS */
/****************/

/**************/
/* MAIN TASKS */
/**************/

// Build dev-version (without watchers)
// You can add your own tasks in queue
gulp.task('build-dev', function (cb) {
    runSequence(
        'service:builder-start-screen',
        'service:clean',
        'css:make-sprite',
        [
            'css:compile-css',
            'html:concat-modules-data',
            'js:move-separate', 'js:processing'
        ],
        [
            'html:compile-templates',
            'other:move-misc-files', 'other:move-fonts', 'other:move-assets',
            'images:move-content-img', 'images:move-plugins-img', 'images:move-general-img'
        ],
        cb
    );
});

// Build release version
// Also you can add your own tasks in queue of build task
gulp.task('build', function () {
    runSequence(
        'build-dev',
        [
            'html:minify-html', 'images:minify-raster-img'
        ],
        'service:pre-build',
        [
            'js:compress', 'css:compress-css'
        ],
        function () {
            console.log(gutil.colors.black.bold('\n------------------------------------------------------------'));
            gutil.log(gutil.colors.green('✔'), gutil.colors.green.bold('Release version have been created successfully!'));
            console.log(gutil.colors.black.bold('------------------------------------------------------------\n'));
        }
    );
});

gulp.task('build:js', function () {
    runSequence(
        'service:clean',
        [
            'js:move-separate', 'js:processing'
        ],
        'service:pre-build',
        'js:compress',
        function () {
            console.log(gutil.colors.black.bold('\n------------------------------------------------------------'));
            gutil.log(gutil.colors.green('✔'), gutil.colors.green.bold('Release version have been created successfully!'));
            console.log(gutil.colors.black.bold('------------------------------------------------------------\n'));
        }
    );
});

gulp.task('build:css', function () {
    runSequence(
        'service:clean',
        [
            'css:compile-css'
        ],
        'service:pre-build',
        'css:compress-css',
        function () {
            console.log(gutil.colors.black.bold('\n------------------------------------------------------------'));
            gutil.log(gutil.colors.green('✔'), gutil.colors.green.bold('Release version have been created successfully!'));
            console.log(gutil.colors.black.bold('------------------------------------------------------------\n'));
        }
    );
});

// Default task. Just start build task
gulp.task('default', function () {
    gulp.start('build');
});

// Init task. Just start init task
gulp.task('init', function () {
    gulp.start('service:init');
});

// Task for starting browsersync module
gulp.task('browsersync', function (cb) {

    // Serve files and connect browsers
    browserSync({
        server: {
            baseDir: browserSyncConfig.baseDir
        },
        logConnections: true,
        debugInfo: true,
        injectChanges: false,
        port: browserSyncConfig.port,
        open: browserSyncConfig.open,
        browser: browserSyncConfig.browser,
        startPath: browserSyncConfig.startUrl,
        notify: browserSyncConfig.useNotifyInBrowser,
        tunnel: useTunnelToWeb
    });

    cb(null);
});

/******************/
/* END MAIN TASKS */
/******************/

/*****************/
/* HELPERS TASKS */
/*****************/

gulp.task('compile-templates-with-data-reloading', function (cb) {
    runSequence(
        'html:concat-modules-data',
        'html:compile-templates',
    cb);
});

/*********************/
/* END HELPERS TASKS */
/*********************/