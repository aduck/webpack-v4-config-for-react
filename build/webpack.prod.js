const merge = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const base = require('./webpack.base')

module.exports = merge(base, {
  mode: 'production',
  optimization: {
    splitChunks: {
      cacheGroups: {
        // 提取css文件
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        },
        // 提取common模块
        commons: {
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 2,
          name: 'common'
        }
      }
    },
    minimizer: [
      // 压缩js
      new TerserPlugin({
        chunkFilter: chunk => chunk.name !== 'vendor',
        cache: true,
        parallel: true
      }),
      // 压缩css
      new OptimizeCSSAssetsPlugin({})
    ]
  }
})