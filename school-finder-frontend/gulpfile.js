var gulp = require('gulp');
var serve = require('gulp-serve');
var mocha = require('gulp-mocha');

gulp.task('default', function() {

});

gulp.task('serve', serve(['app']));

gulp.task('test', function() {
  return gulp.src('tests/**/*_spec.js', {read: false})
    .pipe(mocha({reporter: 'nyan'}));
});
