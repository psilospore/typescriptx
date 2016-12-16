
var webpack = require('webpack'),
    path = require('path');

var PATHS = {
  tsSource: './src/ts'
};

module.exports = {

  resolve: {
    extensions: ['', '.ts', '.js']
  },
  devtool: "#source-map",

  entry: {
    main: PATHS.tsSource + '/index.ts'
  },
  output: {
      path: 'dist',
      filename: '[name].js',
      library: 'monads',
      libraryTarget: 'var'
  },
  module: {
    loaders: [{
      test: /\.ts/,
      loader: 'babel-loader?' + JSON.stringify({
        cacheDirectory: true,
        //plugins: [],
        presets: ['es2015', 'stage-2']
      }) + '!ts-loader',
      exclude: /node_modules/,
    }]
  },
  ts: {
    configFileName: './tsconfig-build.json'
  },

  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};
