import gulp from "gulp";
import gulpSass from "gulp-sass";
import sass from "sass";
import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import rename from "gulp-rename";
import purgecss from "gulp-purgecss";
import browserSync from "browser-sync";
import fileinclude from "gulp-file-include";
import preprocess from "gulp-preprocess";
import template from "gulp-template";
import data from "gulp-data";

import context from "./context.js";

const sassInstance = gulpSass(sass);

const browserSyncInsatance = browserSync.create();

function css() {
  return gulp
    .src("./src/css/styles.scss")
    .pipe(sassInstance().on("error", sassInstance.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(
      rename(function (path) {
        path.extname = ".min.css";
      })
    )
    .pipe(
      purgecss({
        content: ["public/**/*.html"],
      })
    )
    .pipe(gulp.dest("./dist/css/"))
    .pipe(browserSync.stream());
}

function html() {
  return (
    gulp
      .src("./src/**/*.html")
      .pipe(
        fileinclude({
          prefix: "@@",
          basepath: "@file",
        })
      )
      // .pipe(preprocess({ context: context }))
      .pipe(
        data(() => {
          const d = context();
          console.log(d);
          return d;
        })
      )
      .pipe(template())
      .pipe(gulp.dest("./dist/"))
  );
}

function serve() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
}

gulp.watch("./src/styles/**/*.scss", css);

gulp.watch("./context.js", html).on("change", browserSyncInsatance.reload);
gulp.watch("./src/**/*.html", html).on("change", browserSyncInsatance.reload);

export default gulp.parallel(html, css, serve);
