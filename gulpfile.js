var gulp = require('gulp'),
    jshint = require('gulp-jshint');

var paths = {
    js: ['spreaddb.js', 'lib/**/*.js']
};

gulp.task('lint', function() {
    gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
    gulp.watch(paths.js, ['lint']);
});

gulp.task('default', ['watch']);
