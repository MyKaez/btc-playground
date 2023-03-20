const gulp = require('gulp');
//const gutil = require('gutil');;

function getFtpConnection(ftpConfig) {
      const ftp = require('vinyl-ftp')
      return ftp.create({
            host: ftpConfig.url,
            port: 21,
            user: ftpConfig.user,
            password: ftpConfig.password
            //log: gutil.log
      });
}

/** Publishes the dist folder to prod folder on ftp server - config required! */
const prodFilesToPublish = ["./dist/**/*"];
const prodLocation = "fixesth.is";
gulp.task('publish-prod', function () {
      const ftpConfig = require("./.config/private/ftp-deployment.json");
      var conn = getFtpConnection(ftpConfig);
      return gulp.src(prodFilesToPublish, { base: './dist', buffer: false })
            .pipe(conn.newer(prodLocation))
            .pipe(conn.dest(prodLocation));
});

/** Publishes the dist folder to fancy folder on ftp server - config required! */
const filesToPublish = ["./dist/**/*"];
const plebsLocation = "fixesth.is/btc-plebs";
gulp.task('publish-plebs', function () {
      const ftpConfig = require("./.config/private/ftp-deployment.json");
      var conn = getFtpConnection(ftpConfig);
      return gulp.src(filesToPublish, { base: './dist', buffer: false })
            .pipe(conn.newer(plebsLocation))
            .pipe(conn.dest(plebsLocation));
});

/** Publishes the dist folder to fancy folder on ftp server - config required! */
const fancyLocation = "fixesth.is/btc-fancy";
gulp.task('publish-fancy', function () {
      const ftpConfig = require("./.config/private/ftp-deployment.json");
      var conn = getFtpConnection(ftpConfig);
      return gulp.src(filesToPublish, { base: './dist', buffer: false })
            .pipe(conn.newer(fancyLocation))
            .pipe(conn.dest(fancyLocation));
});

/** Publishes the dist folder to prod folder on ftp server - config required! */
const playLocation = "fixesth.is/btc-playground";
gulp.task('publish-playground', function () {
      const ftpConfig = require("./.config/private/ftp-deployment.json");
      var conn = getFtpConnection(ftpConfig);
      return gulp.src(filesToPublish, { base: './dist', buffer: false })
            .pipe(conn.newer(playLocation))
            .pipe(conn.dest(playLocation));
});

const matchSourcesHtml = /<link rel="stylesheet" href="styles\.css(.|\n|\r)*<\/body>/gi;
const defaultSourcesHtml = `<link rel="stylesheet" href="styles.css{version}" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="styles.css{version}"></noscript></head><body class="mat-typography"><app-root></app-root>
<script src="runtime.js{version}" type="module"></script><script src="polyfills.js{version}" type="module"></script><script src="main.js{version}" type="module"></script></body>`;

/** Applys a current timestamp to all js and css references in index.html */
gulp.task('apply-timestamp-to-script-references', () => {
      const modifyFile = require('gulp-modify-file')

      return gulp
            .src('dist/index.html')
            .pipe(modifyFile((content, path, file) => {
                  let date = new Date();
                  let dateVersion = "?v=" + date.getFullYear().toString() + date.getMonth() + date.getDay() + "_" + date.getHours() + date.getMinutes() + date.getSeconds();
                  let sourcesHtml = defaultSourcesHtml.replace(/{version}/gi, dateVersion);

                  content = content.replace(matchSourcesHtml, sourcesHtml);
                  return content;
            }))
            .pipe(gulp.dest('dist'))
})