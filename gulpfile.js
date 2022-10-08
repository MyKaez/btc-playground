const gulp = require('gulp');
//const gutil = require('gutil');
const ftp = require('vinyl-ftp');

function getFtpConnection(ftpConfig){
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
gulp.task('publish-fancy-ftp', function(){
    const ftpConfig = require("./.config/private/ftp-deployment.json");
    var conn = getFtpConnection(ftpConfig);
    return gulp.src(filesToPublish, {base: './dist', buffer: false})
                .pipe(conn.newer(remoteLocation))
                .pipe(conn.dest(remoteLocation));
});