import gulp from "gulp";
import gulpSass from "gulp-sass";
import sass from "sass";
import prefix from "gulp-autoprefixer";
import browserSync from "browser-sync";
import data from "gulp-data";
import path from "path";
import twig from "gulp-twig";
import plumber from "gulp-plumber";
import concat from "gulp-concat";
import sourcemaps from "gulp-sourcemaps";
import fs from "fs";

const { parallel } = gulp;

const sassInstance = gulpSass(sass);

var paths = {
  build: "./dist/",
  scss: "./src/scss/",
  data: "./src/data/",
  js: "./src/js/",
};

const browserSyncInsatance = browserSync.create();

function css() {
  return gulp
    .src(paths.scss + "styles.scss")
    .pipe(sourcemaps.init())

    .pipe(
      plumber({
        handleError: function (err) {
          console.log(err);
          this.emit("end");
        },
      })
    )
    .pipe(
      sassInstance({
        includePaths: [paths.scss],
        outputStyle: "compressed",
      }).on("error", function (err) {
        console.log(err.message);
        // sass.logError
        this.emit("end");
      })
    )
    .pipe(
      prefix(
        [
          "last 15 versions",
          "> 1%",
          "ie 8",
          "ie 7",
          "iOS >= 9",
          "Safari >= 9",
          "Android >= 4.4",
          "Opera >= 30",
        ],
        {
          cascade: true,
        }
      )
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.build + "css/"));
}

function html() {
  return gulp
    .src(["./src/templates/*.twig"])
    .pipe(
      plumber({
        handleError: function (err) {
          console.log(err);
          this.emit("end");
        },
      })
    )
    .pipe(
      data(function (file) {
        return JSON.parse(
          fs.readFileSync(paths.data + path.basename(file.path) + ".json")
        );
      })
    )
    .pipe(
      twig().on("error", function (err) {
        process.stderr.write(err.message + "\n");
        this.emit("end");
      })
    )
    .pipe(gulp.dest(paths.build));
}

function serve() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
}

function js() {
  return gulp
    .src("src/js/script.js")
    .pipe(sourcemaps.init())
    .pipe(concat("script.min.js"))
    .on("error", function (err) {
      console.log(err.toString());
      this.emit("end");
    })
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/js"));
}

gulp.watch("./src/js/**/*.js", js);
gulp.watch("./src/styles/**/*.scss", css);
gulp
  .watch("./src/templates/**/*.twig", html)
  .on("change", browserSyncInsatance.reload);

export default parallel(html, js, css, serve);
