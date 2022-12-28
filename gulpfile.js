import gulp from "gulp";
import gulpSass from "gulp-sass";
import sass from "sass";
import prefix from "gulp-autoprefixer";
import browserSyncImport from "browser-sync";
import data from "gulp-data";
import path from "path";
import twig from "gulp-twig";
import plumber from "gulp-plumber";
import concat from "gulp-concat";
import sourcemaps from "gulp-sourcemaps";
import fs from "fs";
import clean from "gulp-clean";
import fileinclude from "gulp-file-include";
import { deleteAsync } from "del";

const { src, parallel, series, watch, dest } = gulp;

const sassInstance = gulpSass(sass);

var paths = {
  html: "./src/html/*.html",
  dist: "./dist/",
  scss: "./src/scss/",
  data: "./src/data/",
  js: "./src/js/",
};

const browserSync = browserSyncImport.create();

function css() {
  return gulp
    .src(paths.scss + "index.scss")
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
    .pipe(gulp.dest(paths.dist + "css/"));
}

const clear = () => {
  return deleteAsync("./dist");
};

export const html = () => {
  return src([paths.html])
    .pipe(fileinclude())
    .pipe(
      plumber({
        handleError: function (err) {
          console.log(err);
          this.emit("end");
        },
      })
    )
    .pipe(gulp.dest(paths.dist))
    .pipe(browserSync.stream());
};

// function html() {
//   return (
//     gulp
//       .src(["./src/templates/*.twig"])
//       // .pipe(clean({ force: true }))
//       .pipe(
//         plumber({
//           handleError: function (err) {
//             console.log(err);
//             this.emit("end");
//           },
//         })
//       )
//       .pipe(
//         data(function (file) {
//           console.log("reread file");
//           return JSON.parse(
//             fs.readFileSync(paths.data + path.basename(file.path) + ".json")
//           );
//         })
//       )
//       .pipe(
//         twig().on("error", function (err) {
//           console.log(err);
//           this.emit("end");
//         })
//       )
//       .pipe(gulp.dest(paths.dist))
//   );
// }

const server = () => {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
};

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
    .pipe(dest("dist/js"));
}

const assets = () => {
  return src("./assets/**/*")
    .pipe(
      plumber({
        handleError: function (err) {
          console.log(err);
          this.emit("end");
        },
      })
    )
    .pipe(dest("dist/assets"));
};

const updateBrowser = () => {
  browserSync.reload();
};

export const watcher = () => {
  watch("./src/html/**/*.html", html).on("change", updateBrowser);
  watch("./src/scss/**/*.scss", css).on("change", updateBrowser);
  watch("./data/*.json", html).on("change", updateBrowser);
};

export const dev = series(
  clear,
  parallel(assets, html, css, js),
  parallel(watcher, server)
);

// gulp.watch("./src/data/**/*.json", html).on("change", updateBrowser);
// gulp.watch("./src/js/**/*.js", js).on("change", updateBrowser);
// gulp.watch("./src/styles/**/*.scss", css).on("change", updateBrowser);

// export default series(parallel(html, js, css), server);
