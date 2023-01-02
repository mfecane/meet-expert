import gulp from "gulp";
import browserSyncImport from "browser-sync";
import plumber from "gulp-plumber";
import prettify from "gulp-prettify";
import fileinclude from "gulp-file-include";
import htmlmin from "gulp-htmlmin";

const { src, dest } = gulp;

const browserSync = browserSyncImport.create();

export default () => {
  return src(["./src/html/*.html"])
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
    .pipe(prettify({ indent_size: 2, unformatted: ["pre", "code"] }))
    .pipe(dest("./dist/"))
    .pipe(browserSync.stream());
};
