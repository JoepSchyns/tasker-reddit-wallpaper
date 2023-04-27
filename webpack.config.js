import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './src/index.js',
  mode: 'production',
  externals: [
    function ({ context, request }, callback) {
      if (/^.*Tasker\.js$/.test(request)) {
        // Externalize to a commonjs module using the request path
        return callback(null, "this");
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
