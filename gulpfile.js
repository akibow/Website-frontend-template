var path = ''

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
//var typescript = require('gulp-typescript');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();

//jade
gulp.task('jade', function(){
	gulp.src(['_jade/' + path + '**/*.jade', '!_jade/' + path + '**/_*.jade'])
	.pipe(plumber())
	.pipe(jade({
		pretty: '\t',
		basedir: './_jade/'
	}))
	.pipe(gulp.dest('./' + path))
	.on('end',browserSync.reload);
});

//sass
gulp.task('sass', function(){
	gulp.src('_sass/' + path + '**/*.scss')
	.pipe(plumber())
	.pipe(sass({
		outputStyle: 'expanded',
		indentType: 'tab',
		indentWidth: 1
	}))
	.pipe(gulp.dest('./' + path))
	.pipe(sass({
		outputStyle: 'compressed'
	}))
	.pipe(rename({ suffix: '.min' }))
	.pipe(gulp.dest('./' + path))
	.on('end',browserSync.reload);
});

//js
gulp.task('js', function(){
	gulp.src('_js/' + path + '**/*.js')
	.pipe(plumber())
	.pipe(gulp.dest('./' + path))
	.pipe(uglify())
	.pipe(rename({ suffix: '.min' }))
	.pipe(gulp.dest('./' + path));
});

/*/TypeScript
gulp.task('typescript', function(){
	gulp.src(['', '!'])
	.pipe(plumber())
	.pipe(typescript({
		noImplicitAny: true
	}))
	.pipe(gulp.dest('./'))
	.pipe(uglify())
	.pipe(rename({ suffix: '.min' }))
	.pipe(gulp.dest('./'))
});*/

//browserSync
gulp.task('browserSync', function(){
	browserSync.reload();
});

//watch
gulp.task('watch', function(){
	gulp.watch('_jade/' + path + '**/*.jade', ['jade']);
	gulp.watch('_sass/' + path + '**/*.scss', ['sass']);
	gulp.watch('_js/' + path + '**/*.js', ['js']);
	browserSync.init({
		server:{
			baseDir: './'
		}
	});
	//gulp.watch('./**/*.html', ['browserSync']);
	gulp.watch('./' + path + '**/*.js', ['browserSync']);
});

gulp.task('default', ['watch']);