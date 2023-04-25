import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './src/index.js',
  externals: [
    function ({ context, request }, callback) {
      console.log(request);
      console.log("TEST");
      if (/^.*Tasker\.js$/.test(request)) {
	console.log("get", context)
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
