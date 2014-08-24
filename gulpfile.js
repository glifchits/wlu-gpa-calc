var gulp = require('gulp');
var sass = require('gulp-sass');
var karma = require('gulp-karma');
var watch = require('gulp-watch');
var connect = require('gulp-connect');


var testFiles = [
	'js/app.js',
	'test/spec/**/*.js'
];


gulp.task('css', function() {
	watch({ glob: 'scss/*.scss' }, function(files) {
		return files.pipe(sass())
			.pipe(gulp.dest('css'))
			.pipe(connect.reload());
	});
});


gulp.task('test', function() {
	return gulp.src(testFiles)
		.pipe(karma({
			configFile: 'karma.conf.js',
			action: 'run'
		}))
		.on('error', function(err) {
			throw err;
		});
});


gulp.task('server', function() {
	return connect.server({ livereload: true });
});


gulp.task('default', ['server', 'css']);

/*
 , function() {
	gulp.src(testFiles)
		.pipe(karma({
			configFile: 'karma.conf.js',
			action: 'watch'
		}));
});
*/
