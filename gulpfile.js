const
  fs = require('fs');
  gulp = require('gulp'),
  uglify = require('gulp-uglifyjs'),
  cleancss = require('gulp-clean-css')
  rename = require('gulp-rename'),
  cssver = require('gulp-make-css-url-version'),
  filemd5 = require('md5-file');

gulp.task('build:fp', () => {

  let name = 'fp';

  // riot common+component
  gulp.src([
    './web/static/riot/common.js',
    './web/static/riot/component.js',
  ]).pipe(uglify('common+component.min.js', {
    mangle: true
  }))
  .pipe(gulp.dest('./web/static/riot/'));

  // fp
  gulp.src([
    './web/static/'+name+'.js'
  ]).pipe(uglify(name+'.min.js', {
    mangle: true
  }))
  .pipe(gulp.dest('./web/static/'));

  // fp pages
  fs.readdir('./web/static/riot/'+name, (err, files) => {
    if(err) throw 'Read dir error.';
    files.forEach(f => {
      gulp.src([`./web/static/riot/${name}/${f}`])
      .pipe(uglify({ mangle: true }))
      .pipe(gulp.dest('./web/static/riot/'+name+'/'));
    });
  });

  // fp css
  gulp.src('./web/static/css/'+name+'.css')
  .pipe(cleancss())
  .pipe(cssver())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest('./web/static/css/'));

  // md5
  let loaderFile = './web/static/'+name+'.json';
  fs.readFile(loaderFile, (err, data) => {
    let json;
    if(err) throw err;
    json = JSON.parse(data);
    for(let n of ['pro', 'test', 'dev']){
      if(!json[n]){
        throw 'production files not found in json file:' + name+'.json';
      }
      json[n].forEach((f, i) => {
        if(f.split('/')[0] === '.'){
          f =  f.substring(1);
        }
        f = f.replace(/\?v=.+/, '');
        try{
          f = f + '?v=' + filemd5.sync('./web/' + f);
          json[n][i] = f;
        } catch(e) {
          console.log('需要再执行一次');
        }
      });
    }
    fs.writeFileSync(loaderFile, JSON.stringify(json), 'utf8');
  });

});
