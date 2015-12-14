/* eslint-disable */
var webpack = require('webpack');
var path = require('path');

var node_modules_dir = path.resolve(__dirname, 'node_modules');

var PATH = {
  SRC: path.resolve(__dirname, 'src/'),
  DST: path.resolve(__dirname, 'src/'),
};

var config = {
  entry: {
    main: [
      'webpack/hot/dev-server',
      'webpack-dev-server/client?http://localhost:8080',
      path.resolve(PATH.SRC, 'main.js'),
    ],
    vendors: ['three', './libs/PointerLockControls', './libs/stats'],
  },
  output: {
    path: PATH.DST,
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: [node_modules_dir],
      loader: 'babel',
      query: {
        presets: ['es2015'],
      },
    }],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    new webpack.ProvidePlugin({
      THREE: 'three',
    }),
  ],
};

module.exports = config;
