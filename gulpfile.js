var gulp = require('gulp');

gulp.task('vendor', function vendorTask() {
	gulp.src('client/vendor/bootstrap/dist/**/*')
		.pipe(gulp.dest('public/vendor/bootstrap/'));

	gulp.src(['client/vendor/angular/angular.min.js', 'client/vendor/angular/angular.min.js.gzip'])
		.pipe(gulp.dest('public/vendor/angular/'));
});

gulp.task('client', function clientTask() {
    gulp.src('client/css/**/*')
        .pipe(gulp.dest('public/css/'));

    gulp.src('client/index.html')
        .pipe(gulp.dest('public/'));

    gulp.src(['client/app.js'])
        .pipe(gulp.dest('public/'));
});

gulp.task('build', ['vendor', 'client']);

gulp.task('watch', function watchTask() {
   gulp.watch('client/**/*', ['build']);
});