/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-04 13:48:22
 * @LastEditors: wys
 * @LastEditTime: 2022-07-19 09:29:02
 */
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

const {
  resolve,
  join
} = require('path')
const {
  VueLoaderPlugin
} = require('vue-loader')
// 自动注册element 插件
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const {
  ElementPlusResolver
} = require('unplugin-vue-components/resolvers')
const {
  HotModuleReplacementPlugin
} = require('webpack')
module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  output: {
    path: resolve(__dirname, "cdnSlope"),
    // 指定Js输出目录
    filename: 'js/[name].js'
  },
  entry: ['./src/main.ts'],
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    // 配置快捷引入文件
    alias: {
      '@': resolve('src'),
    }
  },
  module: {
    rules: [{
      test: /\.vue$/,
      exclude: /node_modules/,
      use: {
        loader: "vue-loader",
      },
    },
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      // options: {
      //   name: 'js/[name].[hash:8].[ext]'
      // }
    },
    {
      test: /\.(t|j)s$/,
      exclude: /node_modules/,
      use: [{
        loader: 'ts-loader',
        options: {
          // 指定特定的ts编译配置，为了区分脚本的ts配置
          configFile: resolve(__dirname, './tsconfig.json'),
          // 对应文件添加个.ts或.tsx后缀
          appendTsSuffixTo: [/\.vue|ts$/],
          transpileOnly: true, // ? 关闭类型检查，即只进行转译
        },
      },],
      // options:{
      //   outputPath: 'js/'
      // }
    },
    {
      test: /\.css$/,
      use: [{
        loader: 'style-loader',
        options: {
          esModule: false
        },
      },

        'css-loader',
        'postcss-loader'
      ],

      // modules:false
      //  options:{
      //    outputPath: 'css/'
      //  }
    },
    {
      test: /\.s[ac]ss$/i,
      use: [
        // 将 JS 字符串生成为 style 节点
        'style-loader',
        // 将 CSS 转化成 CommonJS 模块
        'css-loader',
        // 将 Sass 编译成 CSS
        'sass-loader',
      ],
    },
    {
      test: /\.less$/,
      exclude: '/node_modules',
      use: [{
        loader: 'style-loader'
      },
      {
        loader: 'css-loader'
      },
      {
        loader: 'less-loader'
      }
      ]
    },
    { // 等价于file-loader
      test: /\.(png|jpe?g|gif|svg)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'img/[name].[hash:6][ext]'
      }
    },
    { // 等价于url-loader
      test: /\.(png|jpe?g|gif|svg)$/i,
      type: 'asset/inline'
    },
    {
      test: /\.(png|jpe?g|gif|svg)$/i,
      type: 'asset',
      generator: {
        filename: 'img/[name].[hash:6][ext]'
      },
      parser: {
        dataUrlCondition: {
          maxSize: 4 * 1024 // 4kb
        }
      }
    },
    {
      test: /\.(woff|woff2|svg|ttf|eot)$/,
      type: 'asset/resource',
      generator: {
        filename: 'fonts/[name].[hash:8].[ext]'
      }
    }
    ]
  },
  devServer: {
    port: 8001,
    open: true,
    hot: true,
    static: {
      directory: join(__dirname, '/src/assets'),
      serveIndex: true,
    },
    proxy: {
      context: ['/examples', '/api',"/cdnSlope"],
      target: 'http://localhost:8001',
    }
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new HotModuleReplacementPlugin(),
    new VueLoaderPlugin(),
    // new dynamicImportNode(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: 'public' },// 将 public 目录复制到输出目录的 public 目录
        // {form:'cdnSlope',to:'cdnSlope'} 
      ],
    }),
    new HtmlWebpackPlugin({
      // 设置HTML入口文件 App绑定的那个文件
      template: './public/index.html',
      title: '边坡监测预警平台',
      // removeComments: true, //是否要删除html中的注释
      // collapaseWhitespace: true, // 是否要删除HTML中多余的空格
      minifyCSS: true, //是否要压缩css文件
      filename: 'index.html', //输出HTML名称
      favicon: './public/favicon.ico',
    }),
  ],
  performance: {
    hints: false
  }
}