// 提取第三方库
const webpack = require('webpack')
const path = require('path')
const resolve = src => path.resolve(__dirname, src)

module.exports = {
  mode: 'production',
  entry: {
    vendor: ['react', 'react-dom']
  },
  output: {
    path: resolve('../dist'),
    filename: 'dll/[name]_dll.js',
    library: '_dll_[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      // 文件输出路径
      path: resolve('../dist/dll/manifest.json'),
      // 要跟output.library一致
      name: '_dll_[name]'
    })
  ]
}
