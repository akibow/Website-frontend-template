const gulp = require('gulp');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
//var rename = require('gulp-rename');
//var typescript = require('gulp-typescript');
//var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();

var src = {
	'html': ['**/*.pug', '!' + '**/_*.pug'],
	'css': ['**/*.scss', '!' + '**/_*.scss'],
	'js': ['**/*.js', '!' + '**/_*.js'],
}

var dest = {
	'root': '../htdocs/',
	'html': '../htdocs/',
	'css': '../htdocs/',
	'js': '../htdocs/',
}

//pug
gulp.task('pug', function(){
	gulp.src(src.html)
	.pipe(plumber({
		errorHnadler: function(err){
			console.log(err.messageFormatted);
			this.emit('end');
		}
	}))
	.pipe(pug({
		pretty: '\t',
		basedir: './',
	}))
	.pipe(gulp.dest(dest.html));
});

//sass
gulp.task('sass', function(){
	gulp.src(src.css)
	.pipe(plumber({
		errorHnadler: function(err){
			console.log(err.messageFormatted);
			this.emit('end');
		}
	}))
	.pipe(sass({
		outputStyle: 'expanded',
		indentType: 'tab',
		indentWidth: 1
	}))
	.pipe(postcss([
		autoprefixer({
			browsers: ["last 1 versions", "ie >= 11", "Android >= 5", "iOS >= 9"],
			cascade: false
		}),
		mqpacker
	]))
	.pipe(gulp.dest(dest.css))
	.pipe(browserSync.stream());
	//.pipe(sass({
	//	outputStyle: 'compressed'
	//}))
	//.pipe(rename({ suffix: '.min' }))
	//.pipe(gulp.dest(dest.css))
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
	gulp.watch('**/*.pug', ['pug']);
	gulp.watch('**/*.scss', ['sass']);
	//gulp.watch(src.js, ['js']);
	gulp.watch(dest.html + '**/*.html').on('change', browserSync.reload);
	//gulp.watch(dest.css + '**/*.css').on('change', browserSync.reload);
	gulp.watch(dest.js + '**/*.js').on('change', browserSync.reload);
	browserSync.init({
		//proxy: 'localhost:****',
		server:{
			baseDir: dest.root
		},
		notify: false,
	});
});

gulp.task('default', ['watch']);