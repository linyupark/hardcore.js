const
  fs = require('fs');
  gulp = require('gulp'),
  uglify = require('gulp-uglifyjs');

gulp.task('build', () => {

  // riot common+component
  gulp.src([
    './web/static/riot/*.js'
  ]).pipe(uglify('common+component.min.js', {
    mangle: true
  }))
  .pipe(gulp.dest('./web/static/riot/'));

  // index
  gulp.src([
    './web/static/index.js'
  ]).pipe(uglify('index.min.js', {
    mangle: true
  }))
  .pipe(gulp.dest('./web/static/'));

  // index pages
  fs.readdir('./web/static/riot/index', (err, files) => {
    if(err) throw 'Read dir error.';
    files.forEach(f => {
      gulp.src([`./web/static/riot/index/${f}`])
      .pipe(uglify({ mangle: true }))
      .pipe(gulp.dest('./web/static/riot/index/'));
    });
  });

});

// TODO: 要给loader里的来源文件加上?md5=xxx来确保刷新缓存
