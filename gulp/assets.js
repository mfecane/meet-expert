import gulp from "gulp";
import imagemin from "gulp-imagemin";
import plumber from "gulp-plumber";

import gifsicle from "imagemin-gifsicle";
import jpegtran from "imagemin-jpegtran";
import optipng from "imagemin-optipng";
import svgo from "imagemin-svgo";
import ttf2woff from "gulp-ttf2woff";

const { src, parallel, dest } = gulp;

const paths = {
  all: "./assets/**/*",
  jpg: "./assets/**/*.jpg",
  png: "./assets/**/*.png",
  svg: "./assets/**/*.svg",
  ttf: "./assets/**/*.ttf",
  ico: "./assets/images/favicon.ico",
};

const imageminOpts = [
  {
    plugins: [
      gifsicle({ interlaced: true }),
      jpegtran({ progressive: true }),
      optipng({ optimizationLevel: 5 }),
      svgo({
        plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
      }),
    ],
  },
];

const files = () => {
  return src([
    paths.all,
    "!" + paths.jpg,
    "!" + paths.png,
    "!" + paths.svg,
    "!" + paths.ttf,
    "!" + paths.ico,
  ])
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

const images = () =>
  src([paths.jpg, paths.png, paths.svg])
    .pipe(
      plumber({
        handleError: function (err) {
          console.log(err);
          this.emit("end");
        },
      })
    )
    .pipe(imagemin(...imageminOpts))
    .pipe(dest("dist/assets"));

const fonts = () =>
  src(paths.ttf)
    .pipe(
      plumber({
        handleError: function (err) {
          console.log(err);
          this.emit("end");
        },
      })
    )
    .pipe(ttf2woff())
    .pipe(dest("dist/assets"));

const favicon = () => {
  return src(paths.ico).pipe(dest("dist/"));
};

export const assets = parallel(files, images, fonts, favicon);
