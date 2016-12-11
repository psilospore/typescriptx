
var webpack = require('webpack'),
    path = require('path');

var PATHS = {
  tsSource: './src/main/ts'
};

module.exports = {
    resolve: {
      extensions: ['', '.ts']
    },

    devtool: "#source-map",

    entry: {
      main: PATHS.tsSource + '/index.ts'
    },
    output: {
        path: 'dist',
        filename: '[name].js'
    },
    module: {
      loaders: [{
        test: /\.ts$/,
        loader: /*'babel?' + JSON.stringify({
          plugins: ['transform-runtime'],
          presets: ['es2015', 'stage-1']
        }) + */'ts-loader',
        include: PATHS.tsSource,
        exclude: /node_modules/,
      }]
    },

    plugins: [
      new webpack.NoErrorsPlugin()
    ]
};
