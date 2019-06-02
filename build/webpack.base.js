const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin  = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const resolve = src => path.resolve(__dirname, src)
const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: {
    app: resolve('../src/app')
  },
  output: {
    path: resolve('../dist'),
    filename: devMode ? '[name].js' : '[name].[hash:8].js'
  },
  resolve: {
    // 路径别名，加上$表示精确匹配到文件
    alias: {
      '@': resolve('../src')
    },
    // 解析后缀
    extensions: ['.js', '.jsx', '.scss', '.json']
  },
  module: {
    // 加载器
    rules: [
      {
        test: /\.(js|jsx).$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                // 支持下一代css autoprefix等
                require('postcss-cssnext')(),
                // css压缩
                require('cssnano')(),
                // px转换rem
                require('postcss-pxtorem')({
                  rootValue: 75, // 750宽
                  unitPrecision: 3, // 保留小数位
                  selectorBlackList: [], // 哪些选择器不要转换
                  propList: ['*'], // 转换属性列表
                  minPixelValue: 12, // 小于这个不转换
                  mediaQuery: false,
                  replace: true
                })
              ]
            }
          },
          'sass-loader',
        ],
        exclude: /node_modules/
      },
      // 转换base64, fallback默认file-loader
      {
        test: /\.(png|jpg|gif|ttf|eot|woff(2)?)(\?[=a-z0-9]+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: devMode ? '[name].[ext]' : '[name].[hash:8].[ext]',
              fallback: 'file-loader'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // 拷贝静态文件
    new CopyPlugin([{
      from: resolve('../static'),
      to: resolve('../dist')
    }]),
    // 把所有的模块放到一个函数里，减少了函数声明，文件体积变小，函数作用域变少
    new webpack.optimize.ModuleConcatenationPlugin(),
    // v4使用MiniCssExtractPlugin代替
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash:8].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash:8].css'
    }),
    // 清空dist文件 需要过滤dll库
    new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/*']}),
    // 根据模板生成html
    new HtmlWebpackPlugin({
      // 模板路径
      template: resolve('../index.html'),
      // 生成html名称
      filename: 'index.html',
      // 参数，模板里用htmlWebpackPlugin.options.title来引入
      title: '口袋里的自由',
      // 引入的js文件
      chunks: ['app'],
      // js是否加hash
      hash: true,
      // 压缩html文件
      minify: {
        // 清除属性“”
        removeAttributeQuotes: true
      }
    }),
    // 链接第三方库
    new webpack.DllReferencePlugin({
      manifest: resolve('../dist/dll/manifest.json')
    })
  ]
}