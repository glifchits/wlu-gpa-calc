var gulp = require('gulp');
var exec = require('child_process').exec;
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var karma = require('gulp-karma');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var htmlReplace = require('gulp-html-replace');


var testFiles = './notafile';


gulp.task('clean', function() {
	// git checkout to undo the changes to index.html
	// due to the `replace` Gulp task
	exec('git checkout -- index.html');
	return gulp.src('build').pipe(clean());
});


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


gulp.task('concatCSS', function() {
	return gulp.src([
		'vendor/*.css',
		'css/*.css'
	])
		.pipe(concat('build.css'))
		.pipe(gulp.dest('build'))
});


gulp.task('concatJS', function() {
	return gulp.src([
		'vendor/angular.js',
		'vendor/jquery.js',
		'vendor/bootstrap.js',
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


gulp.task('default', ['server', 'css']);
