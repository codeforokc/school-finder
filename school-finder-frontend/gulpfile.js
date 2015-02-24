var gulp = require('gulp');
var serve = require('gulp-serve');

gulp.task('default',['serve']);

gulp.task('serve', serve(['app']));


