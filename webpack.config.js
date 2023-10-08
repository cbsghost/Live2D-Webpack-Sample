const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
    main: ['./src/live2d.min.js', './src/index.ts']
  },
  mode: 'production',
  module: {
    rules: [{
        test: /\.tsx?$/i,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.zip$/i,
        type: 'asset/inline'
      }
    ]
  },
  optimization: {
    mangleExports: 'size',
    moduleIds: 'size',
    minimize: true,
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.swcMinify,
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          }
        }
      }),
    ],
  },
  performance: {
    maxEntrypointSize: 6553600,
    maxAssetSize: 6553600
  },
  output: {
    filename: 'app-page-hijiki_widget.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
