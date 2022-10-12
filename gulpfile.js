const gulp = require('gulp');
//const gutil = require('gutil');;

function getFtpConnection(ftpConfig){
      const ftp = require('vinyl-ftp')
      return ftp.create({
            host: ftpConfig.url,
            port: 21,
            user: ftpConfig.user,
            password: ftpConfig.password
            //log: gutil.log
      });
}

const filesToPublish = ["./dist/**/*"];
const remoteLocation = "fixesth.is/btc-fancy";
/** Publishes the dist folder to fancy folder on ftp server - config required! */
gulp.task('publish-fancy-ftp', function(){
      const ftpConfig = require("./.config/private/ftp-deployment.json");
      var conn = getFtpConnection(ftpConfig);
      return gulp.src(filesToPublish, {base: './dist', buffer: false})
                .pipe(conn.newer(remoteLocation))
                .pipe(conn.dest(remoteLocation));
});

/** Publishes the dist folder to prod folder on ftp server - config required! */
const prodRemoteLocation = "fixesth.is/btc-playground";
gulp.task('publish-ftp', function(){
      const ftpConfig = require("./.config/private/ftp-deployment.json");
      var conn = getFtpConnection(ftpConfig);
      return gulp.src(filesToPublish, {base: './dist', buffer: false})
                .pipe(conn.newer(prodRemoteLocation))
                .pipe(conn.dest(prodRemoteLocation));
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
                  let dateVersion = "?v=" + date.getFullYear().toString() + date.getMonth() + date.getDay()+ "_" + date.getHours() + date.getMinutes() + date.getSeconds();
                  let sourcesHtml = defaultSourcesHtml.replace(/{version}/gi, dateVersion);
                  
                  content = content.replace(matchSourcesHtml, sourcesHtml);
                  return content;
            }))
            .pipe(gulp.dest('dist'))
})