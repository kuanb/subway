"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");

// Compile all SASS into CSS and place in Public folder under CSS
gulp.task("sass", function () {
  gulp.src("./gulp/sass/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./public/css"));
});

// Tell Gulp to watch the sass folder for changes
gulp.task("sass:watch", function () {
  gulp.watch("./gulp/sass/**/*.scss", ["sass"]);
});

// Roll all Leaflet utilities that were clumped in JS file from single folder into single file
gulp.task("leafletModules", function () {
  gulp.src("./gulp/leafletModules/*.js")
    .pipe(concat("leafletModules.js"))
    .pipe(gulp.dest("./public/js"));
});

// Tell Gulp to watch the leafletModules folder for changes
gulp.task("leafletModules:watch", function () {
  gulp.watch("./gulp/leafletModules/*.js", ["leafletModules"]);
});


// Run all
gulp.task("default", ["sass:watch", "leafletModules:watch"], function () {});