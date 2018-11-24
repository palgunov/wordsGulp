const gulp = require("gulp");
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const cleanCss = require('gulp-clean-css');
const autoPrefixer = require('gulp-autoprefixer');
const webpack = require("webpack-stream");

gulp.task("compile-css",()=>{
   return gulp.src("./css/src/styles.scss")
       .pipe(sass().on('error',sass.logError))
       .pipe(autoPrefixer({
           browsers:["last 5 versions"]
       }))
       .pipe(cleanCss())
       .pipe(gulp.dest("./dist/"))
});
gulp.task("compile-js", ()=>{
    return gulp.src("./js/src/script.js")
        .pipe(webpack({
            output:{
                filename: "script.pack.js"
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: [{
                            loader: "babel-loader"
                        }]
                    }
                ]
            }

        }))
        .pipe(gulp.dest("./dist/"))
});

gulp.task("watch",()=>{
    gulp.watch("./css/src/**/*.scss",gulp.series("compile-css"))
    gulp.watch("./js/src/**/*.js",gulp.series("compile-js"))
});

gulp.task("default",gulp.series("compile-js","compile-css","watch"));