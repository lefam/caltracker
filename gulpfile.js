var gulp = require('gulp');

gulp.task('build', function buildTask() {
	// Copy index.html from client/ to final public/ folder.
	gulp.src('client/index.html')
		.pipe(gulp.dest('public/'));
});
