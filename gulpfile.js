var gulp = require('gulp');

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('lint', function(){
	return gulp.src('public/javascripts/*.js')
				.pipe(jshint())
				.pipe(jshint.reporter('default'));
});

gulp.task('scripts', function(){
	return gulp.src('public/javascripts/*.js')
				.pipe(concat('all.js'))
				.pipe(gulp.dest('public/dist'))
				.pipe(rename('all.min.js'))
				.pipe(uglify())
				.pipe(gulp.dest('public/dist'));
});

gulp.task('watch', function(){
	gulp.watch('public/javascripts/*.js', ['lint', 'scripts']);
})

gulp.task('default', ['lint', 'scripts', 'watch']);