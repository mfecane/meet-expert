import gulp from "gulp";
import browserSyncImport from "browser-sync";
import concat from "gulp-concat";
import sourcemaps from "gulp-sourcemaps";
import css from "./gulp/scss.js";
import html from "./gulp/html.js";
import assets from "./gulp/assets.js";

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
  watch(["./src/html/**/*.html", "./data/*.json"], html).on(
    "change",
    updateBrowser
  );
  watch("./src/scss/**/*.scss", css).on("change", updateBrowser);
  watch("./src/js/**/*.js", js).on("change", updateBrowser);
};

export const dev = series(
  clear,
  parallel(assets, html, css, js),
  parallel(watcher, server)
);

export const build = series(clear, parallel(assets, html, css, js));

export default build;
