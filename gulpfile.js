import gulp from "gulp";
import browserSyncImport from "browser-sync";
import plumber from "gulp-plumber";
import concat from "gulp-concat";
import sourcemaps from "gulp-sourcemaps";
import prettify from "gulp-prettify";
import fileinclude from "gulp-file-include";
import { css } from "./gulp/scss.js";
import { assets } from "./gulp/assets.js";
import htmlmin from "gulp-htmlmin";

import { deleteAsync } from "del";

const { src, parallel, series, watch, dest } = gulp;

var paths = {
  html: "./src/html/*.html",
  dist: "./dist/",
  scss: "./src/scss/",
  data: "./src/data/",
  js: "./src/js/",
};

const browserSync = browserSyncImport.create();

const clear = () => {
  return deleteAsync("./dist");
};

export const html = () => {
  return src([paths.html])
    .pipe(
      plumber({
        handleError: function (err) {
          console.log(err);
          this.emit("end");
        },
      })
    )
    .pipe(fileinclude())
    .pipe(htmlmin({ collapseWhitespace: false, removeComments: true }))
    .pipe(prettify({ indent_size: 2 }))
    .pipe(gulp.dest(paths.dist))
    .pipe(browserSync.stream());
};

const server = () => {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
};

const js = () => {
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
};

const updateBrowser = () => {
  browserSync.reload();
};

export const watcher = () => {
  watch("./src/html/**/*.html", html).on("change", updateBrowser);
  watch("./src/scss/**/*.scss", css).on("change", updateBrowser);
  watch("./data/*.json", html).on("change", updateBrowser);
  watch("./src/js/**/*.js", js).on("change", updateBrowser);
};

export const dev = series(
  clear,
  parallel(assets, html, css, js),
  parallel(watcher, server)
);

export const build = series(clear, parallel(assets, html, css, js));

export default build;
