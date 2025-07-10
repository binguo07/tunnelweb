/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-04 14:31:44
 * @LastEditors: wys
 * @LastEditTime: 2022-07-04 15:20:23
 */
//webpack.base.conf.js
const path = require("path")

module.exports = function (proMode) {
  return {
    // JavaScript 执行入口文件
    entry: {
      app: path.resolve(__dirname, "../src/main.js")
    },
    output: {
      // 输出文件都放到 dist 目录下
      path: path.resolve(__dirname, "../dist"),
      // 把所有依赖的模块合并输出到一个 bundle.js 文件
      filename: "./js/[name].[chunkhash].js",
      // publicPath: "./",//生产环境时使用
      clean: true
    },
  }
}
