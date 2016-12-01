const
  fs = require('fs');
  gulp = require('gulp'),
  uglify = require('gulp-uglifyjs');

gulp.task('build:fp', () => {

  // riot common+component
  gulp.src([
    './web/static/riot/*.js'
  ]).pipe(uglify('common+component.min.js', {
    mangle: true
  }))
  .pipe(gulp.dest('./web/static/riot/'));

  // fp
  gulp.src([
    './web/static/fp.js'
  ]).pipe(uglify('fp.min.js', {
    mangle: true
  }))
  .pipe(gulp.dest('./web/static/'));

  // fp pages
  fs.readdir('./web/static/riot/fp', (err, files) => {
    if(err) throw 'Read dir error.';
    files.forEach(f => {
      gulp.src([`./web/static/riot/fp/${f}`])
      .pipe(uglify({ mangle: true }))
      .pipe(gulp.dest('./web/static/riot/fp/'));
    });
  });

});

// TODO: 要给loader里的来源文件加上?md5=xxx来确保刷新缓存
