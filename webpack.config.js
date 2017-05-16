var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

module.exports = {

  devtool: 'eval-cheap-module-source-map',

  entry: {
    "main": "./app/main.jsx",
    vendors: ['jquery']
  },

  output: {
    path: BUILD_PATH,
    filename: "[name].bundle.js"
    //filename: '[name].[hash].js'
  },

  plugins: [
    new ExtractTextPlugin('[name].css'),
    new HtmlwebpackPlugin({
      title: 'Hello Zard app'
    })
  ],

  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css') },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!sass') },
      { test: /\.(png|jpg)$/, loader: 'url?limit=8192' },
      { test: /\.jsx?$/, loader: 'babel', query: { presets: ['es2015', 'react'] } },
      { test: /\.(woff|woff2)(?:\?.*|)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(?:\?.*|)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(?:\?.*|)?$/, loader: 'file' },
      { test: /\.svg(?:\?.*|)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },
    ]
  },
  devServer: {
    contentBase: "./build",
    colors: true,
    historyApiFallback: true,
    inline: true,
    port: 8001,
  }
};