/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-04 12:34:20
 * @LastEditors: wys
 * @LastEditTime: 2022-08-23 10:17:09
 */
const { merge } = require('webpack-merge')
const common = require('./webpack.config.js')
const { DefinePlugin } = require("webpack")
module.exports = merge(common, {
  // 本地和测试环境
  mode: 'development',
  plugins: [
    new DefinePlugin({
      'process.env': {
        // VUE_APP_BASE: JSON.stringify('http://192.168.100.98:5566'),
        // VUE_APP_BASE: JSON.stringify('http://192.168.100.122:5566'),
        // VUE_APP_BASE: JSON.stringify('http://192.168.2.47:5566'),
        // VUE_APP_BASE: JSON.stringify('http://192.168.2.19:8080/tunnelSpike'),//测试德会
        // VUE_APP_BASE: JSON.stringify('http://182.140.146.131:7777/tunnelSpike'),//线上德会
        // VUE_APP_BASE: JSON.stringify('http://192.168.2.19:8081/slope-cdn'),//测试成德南边坡
        VUE_APP_BASE: JSON.stringify('https://bp-healthy.bimscodi.cn:8496/tunnelSpike'),//线上K144边坡
        VUE_APP_SOCKET: JSON.stringify('ws://192.168.32.231:4123/event'),
        // VUE_APP_IMGURL: JSON.stringify('http://192.168.100.250:9123'),
        // VUE_APP_IMGURL: JSON.stringify('http://182.140.146.132:7979/'),
        VUE_APP_IMGURL: JSON.stringify('http://182.140.146.131:7777/'),
        VUE_APP_VIDEOSERVER: JSON.stringify('http://192.168.2.19:3000/'),
        VUE_APP_VIDEO: JSON.stringify(''),//这里是视频流连接
        // VUE_APP_BASEQX: 'https://192.168.2.202:7070/portal/api'
      }
    }),
  ]
})