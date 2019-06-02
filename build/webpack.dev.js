const base = require('./webpack.base')
const merge = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')

module.exports = merge(base, {
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    port: 8080,
    host: 'localhost',
    overlay: true,
    compress: true,
    open: true,
    hot: true,
    inline: true,
    progress: true,
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('development')})
  ]
})