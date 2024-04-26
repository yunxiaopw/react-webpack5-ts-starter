import path from 'path'
import { Configuration, DllReferencePlugin } from 'webpack'
import { merge } from 'webpack-merge'
import CopyPlugin from 'copy-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { baseConfig } from './webpack.base'

const prodConfig: Configuration = merge(baseConfig, {
  mode: 'production',
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'), // 复制public下文件
          to: path.resolve(__dirname, '../dist'), // 复制到dist目录中
          filter: source => !source.includes('index.html') // 忽略index.html
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css', // 抽离css的输出目录和名称
      chunkFilename: 'static/css/[name].[chunkhash:8].css'
    }),
    // 打包时生成gzip文件 需要在nginx配置开启gzip
    new CompressionPlugin({
      test: /\.(js|css)$/, // 只生成css,js压缩文件
      filename: '[path][base].gz', // 文件命名
      algorithm: 'gzip', // 压缩格式,默认是gzip
      threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
      minRatio: 0.8 // 压缩率,默认值是 0.8
    }),
    new DllReferencePlugin({
      context: __dirname,
      manifest: path.resolve(__dirname, './dll/react.manifest.json')
    })
  ],
  optimization: {
    realContentHash: true, // 开启真正的contenthash,
    // 减少入口文件打包的体积，运行时代码会独立抽离成一个runtime的文件
    runtimeChunk: {
      name: entrypoint => `runtimechunk-${entrypoint.name}`
    },
    minimize: true, // 开启terser 告诉压缩工具，开启压缩
    minimizer: [
      new CssMinimizerPlugin(), // 压缩css
      new TerserPlugin({
        parallel: true, // 开启多线程压缩
        extractComments: false, // 是否将注释剥离到单独文件，默认是true
        terserOptions: {
          ecma: 5,
          output: {
            comments: false
          },
          sourceMap: false,
          mangle: true, // 开启代码混淆
          compress: {
            ecma: 5,
            keep_fargs: false,
            pure_getters: true, // 代码压缩工具，对象的 getter 方法无副作用，没有使用的时候，可以删除
            hoist_funs: true, // 启用函数提升
            pure_funcs: ['console.log'] // 删除console.log
          }
        }
      })
    ],
    splitChunks: {
      // include all types of chunks 支持异步和非异步共享chunk
      chunks: 'all',
      // 分隔代码
      cacheGroups: {
        vendors: {
          // 提取node_modules代码
          test: /node_modules/, // 只匹配node_modules里面的模块
          minChunks: 1, // 只要使用一次就提取出来
          chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
          minSize: 0, // 提取代码体积大于0就提取出来
          enforce: true,
          reuseExistingChunk: true,
          priority: 10 // 提取优先级为1
        },
        commons: {
          // 提取页面公共代码
          name: 'commons', // 提取文件命名为commons
          minChunks: 2, // 只要使用两次就提取出来
          chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
          priority: 0, // 优先级
          enforce: true,
          reuseExistingChunk: true,
          minSize: 0 // 提取代码体积大于0就提取出来
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  performance: {
    hints: 'warning',
    maxAssetSize: 4000000, // 整数类型（以字节为单位）
    maxEntrypointSize: 5000000 // 整数类型（以字节为单位）
  }
})

export default prodConfig
