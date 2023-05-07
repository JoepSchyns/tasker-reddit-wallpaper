import * as path from 'path';
import * as webpack from 'webpack';

const config : webpack.Configuration = {
  entry: './src/index.ts',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  externals: [
    function ({request} , callback) {
      console.log(request);
      if (/^.*Tasker$/.test(request as string)) {
        // Externalize to a commonjs module using the request path
        return callback(undefined, "this");
      }

      // Continue without externalizing the import
      callback();
    },
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.min.js',
  },
};

export default config;