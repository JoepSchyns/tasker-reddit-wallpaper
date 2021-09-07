const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const fs = require('fs');
const webpack = require('webpack-stream');

gulp.task('build', (done) =>
  gulp
  .src('src/index.js')
  .pipe(
    webpack({
      mode: 'production',
      output: { filename: 'index.min.js' },
      externals: [
        function ({ context, request }, callback) {
          if (/tasker/i.test(request)) {
            // Externalize to a commonjs module using the request path
            return callback(null, 'this');
          }

          // Continue without externalizing the import
          callback();
        },
      ],
    })
  )
  .on('error', function (err) {
    console.error('WEBPACK ERROR', err);
    this.emit('end'); // Don't stop the rest of the task
  })
  .pipe(gulp.dest('./dist/'))
);

gulp.task('pack', () => gulp
    .src('src/index.js')
    .pipe(
      webpack({
        optimization: {
          minimize: false,
        },
        target: 'node',
        mode: 'development',
        output: { filename: 'index.js' },
        devtool: false,
      }),
    )
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end'); // Don't stop the rest of the task
    })
    .pipe(gulp.dest('./.tmp/')),
);

gulp.task(
  'serve',
  gulp.series('pack', (done) => {
    nodemon({
      script: './.tmp/index.js',
      ext: 'js html',
      env: { NODE_ENV: 'development' },
      ignore: ['dist'],
      tasks: ['pack'],
      done() {
        fs.rmdirSync('./.tmp', { recursive: true });
        done();
      },
    });
  })
);
