var {src,series,dest, watch, parallel} = require('gulp');
var jshint = require('gulp-jshint');
const changed = require('gulp-changed');
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
const cleanCSS = require('gulp-clean-css');
const uglify= require('gulp-uglify');

const SOURCE = './js/*.js';
const DESTINATION = 'dist';
const IMAGE_SOURCE = './pre-images/*';
const STYLE_SOURCE = './css/*';

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

function fileWatch(){
     return watch(SOURCE,filesChanged);
}

exports.default = parallel(CompressImage, minifyCss, compressJs, series(lint,fileWatch));
//exports.default = series(lint,CompressImage,fileWatch);
