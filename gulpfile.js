var {src,series,dest, watch, parallel} = require('gulp');
var jshint = require('gulp-jshint');
const changed = require('gulp-changed');
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
const cleanCSS = require('gulp-clean-css');
const uglify= require('gulp-uglify');
const sass = require('gulp-sass');
const less = require('gulp-less');
const concat = require('gulp-concat');
const browsersync = require('browser-sync');
const server = browsersync.create();

const SOURCE = './js/*.js';
const DESTINATION = 'dist';
const IMAGE_SOURCE = './pre-images/*';
const STYLE_SOURCE = './css/*';
const SASS_SOURCE='./sass/*.scss';
const LESS_SOURCE='./less/*.less';

function reload(done){
    server.reload();
    done();
}
function serve(done){
    server.init({
        server:{
            baseDir:'./'
        }
    });
    done();
}

function lint(){
    return src(SOURCE)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
}

function filesChanged(){
    return src(SOURCE)
    .pipe(plumber())
    .pipe(changed(DESTINATION))    
    .pipe(dest(DESTINATION));
}

function CompressImage(){
    return src(IMAGE_SOURCE)
    .pipe(imagemin([imagemin.mozjpeg({progressive:true,quality:75})]))
    .pipe(dest('dist/images'))
}

function minifyCss(){
    return src(STYLE_SOURCE)
    .pipe(cleanCSS({        
        level:1
    }))
    .pipe(dest('dist/css'));
}

function compressJs() {
    return src('./js/*.js')
          .pipe(uglify())
          .pipe(dest('dist/js'));
}

function compileSass(){
    return src(SASS_SOURCE)
    .pipe(sass())
    .pipe(dest('dist/sass'));
}

function compileLess(){
    return src(LESS_SOURCE)
    .pipe(less())
    .pipe(dest('dist/less'));
}

function concatJSFiles(){
    return src(SOURCE)
    .pipe(concat('all.js'),{newline:';'})
    .pipe(dest('dist'));
}
/*
function fileWatch(){
     return watch(SOURCE,filesChanged);
}
*/

function fileWatch(){
     watch([STYLE_SOURCE,SOURCE],series(minifyCss,compressJs,compileSass,compileLess,reload));
}

exports.default = series(CompressImage, minifyCss, compileSass, compileLess,compressJs,serve,fileWatch);
//exports.default = parallel(CompressImage, minifyCss, compileSass, compileLess, series(compressJs,lint,concatJSFiles,fileWatch));
//exports.default = series(lint,CompressImage,fileWatch);
