// gulpfile.js

const settings = require("./package.json").settings;
const gulp = require("gulp");
const del = require("del");
const ts = require("gulp-typescript");
const browserify = require("browserify");
const browserifyInc = require("browserify-incremental");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify-es").default;
const sourcemaps = require("gulp-sourcemaps");
const gutil = require("gulp-util");
const gulpif = require("gulp-if");
const changed = require("gulp-changed");
const browserSync = require("browser-sync");
const runSequence = require("run-sequence");
const tape = require("gulp-tape");
const through = require("through2");
const fs = require("fs");
const merge = require("merge2");

const debug = settings.debug === true;

if (debug) { console.log("=== DEBUG Environment ===") }
else { console.log("=== RELEASE Environment ==="); }

// Clean destination directory
gulp.task("clean", () => {
    let files = ["./.cache.json", "./*.log"];
    if (debug) { files.push(settings.paths.debug + "*"); }
    else { files.push(settings.paths.release + "*"); }

    return del(files);
});

// Clean destination directory for all environnements
gulp.task("clean:all", () => {
    let files = ["./.cache.json", "./*.log"];
    files.push(settings.paths.debug + "*");
    files.push(settings.paths.release + "*");

    return del(files);
});

// Compile TypeScript files
gulp.task("compile", () => {
    let config = "";
    let dest = "";

    if (debug) {
        config = settings.tsconfig.debug;
        dest = settings.paths.debug;
    }
    else {
        config = settings.tsconfig.release;
        dest = settings.paths.release;
    }

    let tsProject = ts.createProject(config);
    const tsResult = tsProject.src()
        .pipe(gulpif(debug, sourcemaps.init()))
        .pipe(tsProject());

    return merge([
        tsResult.js
            .pipe(gulpif(debug, sourcemaps.write()))
            .pipe(gulp.dest(dest)),
        tsResult.dts
            .pipe(gulp.dest(dest))])
        .on("error", gutil.log);
});

// Bundle JavaScript files into a single file
gulp.task("bundle", ["compile"], () => {
    const bundleFilename = settings.bundle;
    const mainFilename = settings.main;
    let dest = "";

    if (debug) { dest = settings.paths.debug;  }
    else { dest = settings.paths.release; }

    return browserifyInc({
            "entries": dest + mainFilename,
            "debug": true,
            "cache": "./.cache.json"
        })
        .bundle()
        .pipe(source(bundleFilename))
        .pipe(buffer())
        .pipe(gulpif(debug, sourcemaps.init({ loadMaps: true })))
        .pipe(uglify())
        .pipe(gulpif(debug, sourcemaps.write()))
        .pipe(gulp.dest(dest))
        .on("error", gutil.log)
        .on("finish", () => {
            if (!debug) {
                del([dest + "*.js", "!" + dest + bundleFilename]);
            }
        });
});

// Copy all static assets
gulp.task("copy", () => {
    let dest = "";

    if (debug) { dest = settings.paths.debug;  }
    else { dest = settings.paths.release; }

    gulp.src(settings.paths.src + "*.html")
        .pipe(changed(dest))
        .pipe(gulp.dest(dest));

    gulp.src(settings.paths.srcImages + "**")
        .pipe(changed(dest))
        .pipe(gulp.dest(dest + settings.paths.tgtImages));

    gulp.src(settings.paths.srcCss + "**")
        .pipe(changed(dest))
        .pipe(gulp.dest(dest + settings.paths.tgtCss));
});

// Rebuild on change
gulp.task("watch", () => {
    runSequence(["bundle", "copy"], "test");
    gulp.watch(settings.paths.src + "**", () => {
        runSequence(["bundle", "copy"], "test");
    });
});

// Launch the HTTP server
gulp.task("serve", () => {
    let dest = "";

    if (debug) { dest = settings.paths.debug;  }
    else { dest = settings.paths.release; }
    
    browserSync.init({
        "port": settings.port,
        "server": dest
    });
});

// Rebuild on change and refresh the browser
gulp.task("watchRefresh", () => {
    runSequence(["bundle", "copy"], ["serve", "test"]);
    gulp.watch(settings.paths.src + "**", () => {
        runSequence(["bundle", "copy"], "test", browserSync.reload);
    });
});

// Default task
gulp.task("default", ["bundle", "copy"]);

// Unit tests
gulp.task("test", () => {
    if (!debug) return;

    process.stdout.write("\x1Bc");
    const reporter = through.obj();
    reporter
        .pipe(process.stdout);

    return gulp.src(settings.paths.tests + "*.js")
        .pipe(tape({
            "bail": false,
            "outputStream": fs.createWriteStream(settings.paths.tests + "tape.log"),
            "reporter": reporter
        }));
});
