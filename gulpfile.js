
var gulp = require("gulp");
var uglify = require("gulp-uglify");
var rename = require('gulp-rename');

gulp.task('package', function () {
   return gulp.src('dist/taffy.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['package']);
