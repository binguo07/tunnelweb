/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-04 12:34:20
 * @LastEditors: wys
 * @LastEditTime: 2022-07-15 10:21:11
 */
const { merge } = require('webpack-merge')
const common = require('./webpack.config.js')
const { DefinePlugin } = require("webpack")
module.exports = merge(common, {
  // 线上环境
  mode: 'production',
  plugins: [
    new DefinePlugin({
      'process.env': {
        // VUE_APP_BASE: JSON.stringify('http://192.168.2.19:8080/tunnelSpike'),
        VUE_APP_BASE: JSON.stringify('http://182.140.146.131:7777/tunnelSpike'),//线上德会
        // VUE_APP_BASE: JSON.stringify('http://192.168.2.19:8081/slope-cdn'),
        // VUE_APP_BASE: JSON.stringify('http://47.108.254.101:8080/slope-cdn'),//线上K144边坡
        // VUE_APP_BASE: JSON.stringify('http://192.168.2.18:5566/tunnel'),
        VUE_APP_SOCKET: JSON.stringify('ws://192.168.32.231:4123/event'),
        // VUE_APP_IMGURL: JSON.stringify('http://192.168.2.19:8080/tunnelSpike/'),
        // VUE_APP_IMGURL: JSON.stringify('http://192.168.2.168:9977/'),
        VUE_APP_IMGURL: JSON.stringify('http://182.140.146.131:7777/'),
        VUE_APP_VIDEOSERVER: JSON.stringify('http://192.168.2.19:3000/'),
        // VUE_APP_BASEQX: 'https://192.168.2.202:7070/portal/api'
      }
    }),
  ]

})