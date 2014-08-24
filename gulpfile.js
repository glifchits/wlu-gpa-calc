var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var connect = require('gulp-connect');


gulp.task('css', function() {
	watch({ glob: 'scss/*.scss' })
		.pipe(sass())
		.pipe(gulp.dest('css'))
		.pipe(connect.reload());
});


gulp.task('server', function() {
	connect.server({ livereload: true });
});


gulp.task('default', ['server', 'css']);
