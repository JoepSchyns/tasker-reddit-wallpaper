const gulp = require('gulp');
const concat = require('gulp-concat');
const nodemon = require('gulp-nodemon');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const fs = require('fs');

gulp.task('preprocess', () =>
  gulp
  .src(['./src/Tasker.js', './src/index.js'])
  .pipe(concat('index.js'))
  .pipe(gulp.dest('./.tmp/'))
);
gulp.task('build', () => gulp
    .src('./src/index.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist/')),
);

gulp.task(
  'serve',
  gulp.series('preprocess', (done) => {
    nodemon({
      script: './.tmp/index.js',
      ext: 'js html',
      env: { NODE_ENV: 'development' },
      ignore: ['dist'],
      tasks: ['preprocess'],
      done() {
        fs.rmdirSync('./.tmp', { recursive: true });
        done();
      },
    });
  })
);
