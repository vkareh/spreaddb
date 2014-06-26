var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');

var paths = {
  js: ['spreaddb.js', 'lib/**/*.js'],
  test: ['test/*.js']
};

gulp.task('lint', function() {
  gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('test', function (done) {
  gulp.src(paths.js)
    .pipe(istanbul())
    .on('finish', function() {
      gulp.src(paths.test)
        .pipe(mocha({reporter: 'spec'}))
        .pipe(istanbul.writeReports())
        .on('error', function() {})
        .on('end', done);
    });
});

gulp.task('watch', function() {
  gulp.watch(paths.js, ['lint', 'test']);
  gulp.watch(paths.test, ['test']);
});

gulp.task('default', ['lint', 'test', 'watch']);
