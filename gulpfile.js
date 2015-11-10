var gulp = require('gulp');

gulp.task('vendor', function vendorTask() {
	gulp.src('client/vendor/bootstrap/dist/**/*')
		.pipe(gulp.dest('public/vendor/bootstrap/'));

	gulp.src(['client/vendor/angular/angular.min.js', 'client/vendor/angular/angular.min.js.gzip'])
		.pipe(gulp.dest('public/vendor/angular/'));

    gulp.src(['client/vendor/angular-ui-router/release/angular-ui-router.min.js'])
        .pipe(gulp.dest('public/vendor/angular-ui-router/'));
});

gulp.task('client', function clientTask() {
    gulp.src('client/partials/**/*')
        .pipe(gulp.dest('public/partials/'));

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