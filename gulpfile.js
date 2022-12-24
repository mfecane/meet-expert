import gulp from "gulp";
import gulpSass from "gulp-sass";
import sass from "sass";
import prefix from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import rename from "gulp-rename";
import purgecss from "gulp-purgecss";
import browserSync from "browser-sync";
import fileinclude from "gulp-file-include";
import preprocess from "gulp-preprocess";
import template from "gulp-template";
import data from "gulp-data";
import path from 'path'
import twig from 'gulp-twig'
import plumber from 'gulp-plumber'
import concat from 'gulp-concat'
import sourcemaps from 'gulp-sourcemaps'
import fs from 'fs'
const sassInstance = gulpSass(sass);
const {parallel, series} = gulp

// var gulp = require('gulp'),
//     path = require('path'),
//     data = require('gulp-data'),
//     twig = require('gulp-twig'), // Decided to use twig, because already familiar with it
//     prefix = require('gulp-autoprefixer'),
//     sass = require('gulp-sass'),    
//     plumber = require('gulp-plumber'),
//     concat = require('gulp-concat'),
//     sourcemaps = require('gulp-sourcemaps'),
//     browserSync = require('browser-sync'),
//     fs = require('fs');

var paths = {
  build: "./dist/",
  scss: "./src/scss/",
  data: "./src/data/",
  js: "./src/js/",
};

// gulp.task("twig", function () {
//   return gulp
//     .src(["./src/templates/*.twig"])

//     .pipe(
//       plumber({
//         handleError: function (err) {
//           console.log(err);
//           this.emit("end");
//         },
//       })
//     )

//     .pipe(
//       data(function (file) {
//         return JSON.parse(
//           fs.readFileSync(paths.data + path.basename(file.path) + ".json")
//         );
//       })
//     )
//     .pipe(
//       twig().on("error", function (err) {
//         process.stderr.write(err.message + "\n");
//         this.emit("end");
//       })
//     )
//     .pipe(gulp.dest(paths.build));
// });

// gulp.task("rebuild", ["twig"], function () {
//   browserSync.reload();
// });

// gulp.task("browser-sync", ["sass", "twig", "js"], function () {
//   browserSync({
//     server: {
//       baseDir: paths.build,
//     },
//     notify: false,
//     browser: "google chrome",
//   });
// });



// gulp.task("sass", function () {
//   return gulp
//     .src(paths.scss + "vendors/main.scss")
//     .pipe(sourcemaps.init())

//     .pipe(
//       plumber({
//         handleError: function (err) {
//           console.log(err);
//           this.emit("end");
//         },
//       })
//     )
//     .pipe(
//       sassInstance({
//         includePaths: [paths.scss + "vendors/"],
//         outputStyle: "compressed",
//       }).on("error", function (err) {
//         console.log(err.message);
//         // sass.logError
//         this.emit("end");
//       })
//     )
//     .pipe(
//       prefix(
//         [
//           "last 15 versions",
//           "> 1%",
//           "ie 8",
//           "ie 7",
//           "iOS >= 9",
//           "Safari >= 9",
//           "Android >= 4.4",
//           "Opera >= 30",
//         ],
//         {
//           cascade: true,
//         }
//       )
//     )
//     .pipe(sourcemaps.write("."))
//     .pipe(gulp.dest(paths.build + "/assets/css/"));
// });

// gulp.task("js", function () {
//   return gulp
//     .src(paths.js + "script.js")
//     .pipe(sourcemaps.init())
//     .pipe(concat("script.min.js"))
//     .on("error", function (err) {
//       console.log(err.toString());
//       this.emit("end");
//     })
//     .pipe(sourcemaps.write("."))
//     .pipe(gulp.dest(paths.build + "assets/js"));
// });

// gulp.task("watch", function () {
//   gulp.watch(paths.js + "script.js", ["js", browserSync.reload]);
//   gulp.watch(paths.scss + "**/*.scss", ["sass", browserSync.reload]);
//   gulp.watch(
//     ["src/templates/**/*.twig", "src/data/*.twig.json"],
//     { cwd: "./" },
//     ["rebuild"]
//   );
// });

// gulp.task("build", ["sass", "twig"]);
// gulp.task("default", ["browser-sync", "watch"]);


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

function twigTask() {
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

const t1 = series(twigTask, html)

gulp.watch("./src/styles/**/*.scss", css);

gulp.watch("./context.js", html).on("change", browserSyncInsatance.reload);
gulp.watch("./src/**/*.html", html).on("change", browserSyncInsatance.reload);

export default parallel(t1, css, serve)