var gulp = require('gulp');
var exec = require('gulp-exec');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var karma = require('gulp-karma');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var htmlReplace = require('gulp-html-replace');


gulp.task('clean', function() {
	return gulp.src('build').pipe(clean())
	// git checkout to undo changes to index.html in `replace` task
		.pipe(exec('git checkout -- index.html'));
});


gulp.task('html', function() {
	watch({ glob: './**/*.html' }, function(files) {
		return connect.reload();
	});
});


gulp.task('js', function() {
	watch({ glob: 'js/**/*.js' }, function(files) {
		return connect.reload();
	});
});


gulp.task('css', function() {
	watch({ glob: 'scss/*.scss' }, function(files) {
		return files
			.pipe(sass())
			.pipe(concat('styles.css'))
			.pipe(gulp.dest('css'))
			.pipe(connect.reload());
	});
});


gulp.task('test', function() {
	return gulp.src('./notafile')
		.pipe(karma({
			configFile: 'karma.conf.js',
			action: 'run'
		}))
		.on('error', function(err) {
			throw err;
		});
});


gulp.task('concatCSS', function() {
	return gulp.src([
		'vendor/*.css',
		'css/*.css'
	])
		.pipe(concat('build.css'))
		.pipe(gulp.dest('build'));
});


gulp.task('concatJS', function() {
	return gulp.src([
		'vendor/angular.js',
		'vendor/jquery.js',
		'vendor/bootstrap.js',
		'vendor/*.js',
		'js/app.js'
	])
		.pipe(concat('build.js'))
		.pipe(gulp.dest('build'));
});


gulp.task('replace', function() {
	return gulp.src('index.html')
		.pipe(htmlReplace({
			'css': 'build/build.css',
			'js': 'build/build.js'
		}))
		.pipe(gulp.dest('.'));
});


gulp.task('build', ['clean', 'css', 'concatCSS', 'concatJS', 'replace'], function() {
	connect.server();
});


gulp.task('default', ['css'], function() {
	connect.server({
		livereload: true
	});
});
