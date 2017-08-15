var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleancss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel');

    var rollup = require("rollup");


var adminSrc = 'admin/assets/src/';
var adminDest = 'admin/assets/';
var publicSrc = 'public/assets/src/';
var publicDest = 'public/assets/';
var DEBUG = true;


function scripts(src, dest) {
    var rollupPlugins = [
        require("rollup-plugin-babel")({
            presets: ["es2015-rollup"]
        })
    ];

    if (!DEBUG) {
        rollupPlugins.push(require("rollup-plugin-uglify")());
    }

    rollup.rollup({
      entry: src + "/main.js",
      plugins: rollupPlugins,
    }).then(bundle => {
      return bundle.generate({
        // output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
        format: 'iife'
      });
    }).then(result => {
        require("fs").writeFileSync(dest, result.code);
    }).then(null, err => console.error(err));
}

function styles(src, dest) {

    if (DEBUG) {
        return gulp.src(src)
            .pipe(sourcemaps.init())
            .pipe(sass.sync().on('error', sass.logError))
            .pipe(sass({ outputStyle: 'expanded' }))
            .pipe(autoprefixer('last 2 version'))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(dest));
    } else {
        return gulp.src(src)
            .pipe(rename({ suffix: '.min' }))
            .pipe(sass.sync().on('error', sass.logError))
            .pipe(sass({ outputStyle: 'compressed' }))
            .pipe(autoprefixer('last 2 version'))
            .pipe(cleancss({compatibility: 'ie9'}))
            .pipe(gulp.dest(dest));
    }
}

gulp.task('public_scripts', function () {
    var min = DEBUG ? '' : '.min';
    return scripts(publicSrc + 'js', publicDest + 'js/public' + min + '.js');
});

gulp.task('admin_scripts', function() {
    var min = DEBUG ? '' : '.min';
    return scripts(adminSrc + 'js', adminDest + 'js/admin' + min + '.js');
});

gulp.task('public_styles', function () {
    return styles(publicSrc + 'scss/*.scss', publicDest + 'css');
});

gulp.task('admin_styles', function() {
    return styles(adminSrc + 'scss/*.scss', adminDest + 'css');
});

gulp.task('clean', function (cb) {
    return del([adminDest + 'js/*.*', adminDest + 'css/*.*', publicDest + 'js/*.*', publicDest + 'css/*.*']);
});

gulp.task('watch', function () {
    gulp.watch(adminSrc + 'scss/**/*.scss', ['admin_styles']);
    gulp.watch(adminSrc + 'js/**/*.js', ['admin_scripts']);

    gulp.watch(publicSrc + 'scss/**/*.scss', ['public_styles']);
    gulp.watch(publicSrc + 'js/**/*.js', ['public_scripts']);

    // LiveReload
    livereload.listen();
    gulp.watch([adminDest + 'js/**', adminDest + 'css/**', publicDest + 'js/**', publicDest + 'css/**']).on('change', livereload.changed);
});

// clear cache after clean

gulp.task('clear', function (done) {
    return cache.clearAll(done);
});

gulp.task('build', ['admin_scripts', 'public_scripts', 'admin_styles', 'public_styles'], function() {
    DEBUG = false;
    gulp.start('admin_scripts', 'public_scripts', 'admin_styles', 'public_styles');
});

gulp.task('default', ['clean', 'clear'], function () {
    gulp.start('build');
});