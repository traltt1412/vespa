
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const del = require('del');
const merge = require('merge-stream');
const runSequence = require('run-sequence');

const $ = gulpLoadPlugins();

const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

let dev = true;
let assetPath = 'assets';
const config = require('./config.json');

gulp.task('js', () => {
  return gulp.src(`${config.src.js}/app.js`)
    .pipe(webpackStream(require('./webpack.dev.js'), webpack))
    .pipe(gulp.dest(config.tmp));
});

gulp.task('build:js', () => {
  return gulp.src(`${config.src.js}/app.js`)
    .pipe(webpackStream(require('./webpack.prod.js'), webpack))
    .pipe(gulp.dest(config.dist));
});

gulp.task('images', () => {
  return gulp.src([
    'app/'+ assetPath +'/images/**/*',
    '!app/'+ assetPath +'/images/sprites-retina',
    '!app/'+ assetPath +'/images/sprites',
    '!app/'+ assetPath +'/images/sprites-retina/**',
    '!app/'+ assetPath +'/images/sprites/**'
    ])
    .pipe($.plumber({errorHandler: $.notify.onError('Error: <%= error.message %>')}))
    .pipe(gulp.dest(`${config.dist}/${config.img}`))
    .pipe($.plumber.stop());
});

gulp.task('sprite', function () {
  let retinaSpriteData = gulp.src('app/'+ assetPath +'/images/sprites-retina/*.*')
  .pipe($.spritesmith({
    retinaSrcFilter: ['app/'+ assetPath +'/images/sprites-retina/*@2x.png'],
    imgName: 'sprites-retina.png',
    retinaImgName: 'sprites-retina@2x.png',
    cssName: '_retinaSprites.css',
    padding: 5,
    imgPath: ('../images/sprites-retina.png?t=' + (new Date()).getTime()),
    retinaImgPath: ('../images/sprites-retina@2x.png?t=' + (new Date()).getTime())
  }));

  let spriteData = gulp.src('app/'+ assetPath +'/images/sprites/*.*')
  .pipe($.spritesmith({
    imgName: 'sprites.png',
    cssName: '_sprites.css',
    padding: 5,
    imgPath: ('../images/sprites.png?t=' + (new Date()).getTime())
  }));

  // Output our images
  let retinaSpritesImgStream  = retinaSpriteData.img.pipe(gulp.dest('app/'+ assetPath +'/images'));
  let spritesImgStream        = spriteData.img.pipe(gulp.dest('app/'+ assetPath +'/images'));

  // Concatenate our CSS streams
  let cssStream = merge(retinaSpriteData.css, spriteData.css)
  .pipe($.concat('_all-sprites.scss'))
  .pipe(gulp.dest('app/'+ assetPath +'/css/base'));

  // Return a merged stream to handle all our `end` events
  return merge(retinaSpritesImgStream, spritesImgStream, cssStream);
});

gulp.task('fonts', function() {
  gulp.src('app/'+ assetPath +'/fonts/*.*')
  .pipe($.if(dev, gulp.dest('.tmp/'+ assetPath +'/fonts/'), gulp.dest('dist/'+ assetPath +'/fonts/')));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    '!app/**/*.twig',
    '!app/_templates',
    '!app/_templates/**',
    '!app/_data',
    '!app/_data/**',
    '!app/'+ assetPath +'/images/sprites-retina',
    '!app/'+ assetPath +'/images/sprites',
    '!app/'+ assetPath +'/images/sprites-retina/**',
    '!app/'+ assetPath +'/images/sprites/**'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
  return gulp.src(['.tmp/', 'dist/'], { read: false })
    .pipe($.rimraf({
      force: true
    }));
});

gulp.task('serve', () => {
  runSequence(['sprite'], ['js', 'fonts']);
});

gulp.task('build', () => {
  runSequence(['sprite'], ['build:js', 'images', 'fonts', 'extras'], () => {
    return gulp.src('dist/**/*');
  });
});

gulp.task('default', ['clean'], () => {
  dev = false;
  gulp.start('build');
});
