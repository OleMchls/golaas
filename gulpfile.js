var gulp = require('gulp')
var babel = require('gulp-babel')
var watch = require('gulp-watch')
var server = require('gulp-express')
var batch = require('gulp-batch')
var sass = require('gulp-sass')

gulp.task('default', function () {
  // place code for your default task here
})

gulp.task('server', ['build'], function () {
  // Start the server at the beginning of the task
  server.run(['index.js'], {}, false)

  gulp.watch('assets/js/*', ['javascript'])
  gulp.watch('assets/styles/*', ['styles'])
})

gulp.task('build', ['javascript', 'styles'])

gulp.task('javascript', function () {
  var src = 'assets/js/*.js'
  gulp.src(src)
    .pipe(watch(src))
    .pipe(babel())
    .pipe(gulp.dest('public/js'))
})

gulp.task('styles', function () {
  var src = 'assets/styles/*.scss'
  gulp.src(src)
    .pipe(watch(src))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/styles'))
})
