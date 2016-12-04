var gulp = require('gulp'); 
var autoprefixer = require('gulp-autoprefixer');//autoprefix le css
var cssnano = require('gulp-cssnano'); 			//minifie le css
var rename = require("gulp-rename");			//renomme les fichiers (notamment extension .min.)
var sass = require('gulp-sass'); 				//sass
var plumber = require('gulp-plumber');			//montre les erreurs
var browserSync = require('browser-sync');		//
var imagemin = require('gulp-imagemin');		//optimise les img
var cache = require('gulp-cache');				//met en cache
var uglify = require('gulp-uglify');			//minifie le js


/***********
WORK TASK
***********/

//task gulp css
gulp.task('css', function(){
	return gulp.src('sass/**/*.scss')//Prend tous les fichiers .scss dans sass/**/
				.pipe(plumber({
					errorHandler: function(err){
						console.log(err);
						this.emit('end');
					}
				}))
				.pipe(sass({ outputStyle: 'expanded'}))
				.pipe(autoprefixer())
				.pipe(gulp.dest('css'))
				.pipe(rename({suffix: '.min'}))
				.pipe(cssnano())
				.pipe(gulp.dest('css'))
    			.pipe(browserSync.stream());
});

//task browser sync
gulp.task('serve', ['css'], function() {
  	browserSync({
		server: {
			baseDir: './'
		},
  	})
});

//Watch css only
gulp.task('look', function(){
	gulp.watch('sass/**/*.scss', ['css']);
});

//task gulp watch
gulp.task('watch', ['serve', 'css'], function(){
	gulp.watch('sass/*.scss', ['css']);

	gulp.watch('js/*.js', browserSync.reload);
	gulp.watch('./*.html', browserSync.reload);
	gulp.watch('css/*.css', browserSync.reload);
});


//Image minifier
gulp.task('images', function(){
    gulp.src('img/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin({
        	interlaced: true,
        	progressive: true,
    		optimizationLevel: 5
        })))
        .pipe(gulp.dest('img'));
});

//Js minify
gulp.task('jsmini', function(){
	gulp.src('js/*.js')
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('js'));
});

/***********
COPY TO DIST
***********/

//Copy font, js, css, img to dist
gulp.task('copy', function(){
	gulp.src('css/*.css')
		.pipe(gulp.dest('css'))
	gulp.src('js/*.js')
		.pipe(gulp.dest('js'))
	gulp.src('font/*')
		.pipe(gulp.dest('font'))
	gulp.src('img/**/*.+(png|jpg|jpeg|gif|svg)')
		.pipe(gulp.dest('img'));
});

