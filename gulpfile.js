var gulp = require('gulp'),
    del = require('del'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    removeCode = require('gulp-remove-code');

var clientJS = [
    'client/app.js',
    'client/directives/**/*',
    'client/services/**/*',
    'client/controllers/**/*'
];

gulp.task('clean', function() {
    return del.sync(['public/']);
});

gulp.task('vendor', function vendorTask() {
	gulp.src('client/vendor/bootstrap/dist/**/*')
		.pipe(gulp.dest('public/vendor/bootstrap/'));

	gulp.src(['client/vendor/angular/angular.min.js', 'client/vendor/angular/angular.min.js.gzip'])
		.pipe(gulp.dest('public/vendor/angular/'));

    gulp.src(['client/vendor/angular-ui-router/release/angular-ui-router.min.js'])
        .pipe(gulp.dest('public/vendor/angular-ui-router/'));

    gulp.src(['client/vendor/pickadate/lib/**/*'])
        .pipe(gulp.dest('public/vendor/pickadate/'));

    gulp.src(['client/vendor/angular-loading-bar/**/*'])
        .pipe(gulp.dest('public/vendor/angular-loading-bar/'));

    gulp.src(['client/vendor/jquery/dist/**/*'])
        .pipe(gulp.dest('public/vendor/jquery/'));
});

gulp.task('client', function clientTask() {
    gulp.src('client/app.js')
        .pipe(gulp.dest('public/'));

    gulp.src('client/partials/**/*')
        .pipe(gulp.dest('public/partials/'));

    gulp.src('client/directives/**/*')
        .pipe(gulp.dest('public/directives/'));

    gulp.src('client/services/**/*')
        .pipe(gulp.dest('public/services/'));

    gulp.src('client/controllers/**/*')
        .pipe(gulp.dest('public/controllers/'));

    gulp.src('client/css/**/*')
        .pipe(gulp.dest('public/css/'));

    gulp.src('client/index.html')
        .pipe(removeCode({development: true}))
        .pipe(gulp.dest('public/'));

});

gulp.task('client-dist', function clientDistTask() {
    gulp.src(clientJS )
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/'));

    gulp.src('client/css/**/*')
        .pipe(minifyCss())
        .pipe(gulp.dest('public/css/'));

    gulp.src('client/partials/**/*')
        .pipe(gulp.dest('public/partials/'));

    gulp.src('client/index.html')
        .pipe(removeCode({production: true}))
        .pipe(gulp.dest('public/'));
});

gulp.task('build-dev', ['clean', 'vendor', 'client']);
gulp.task('build', ['clean', 'vendor', 'client-dist']);

gulp.task('watch', function watchTask() {
   gulp.watch('client/**', ['client']);
});