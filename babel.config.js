/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-04 10:28:07
 * @LastEditors: wys
 * @LastEditTime: 2022-07-05 14:22:29
 */
module.exports = {
  presets: [
    [
      '@babel/preset-env',
    ],
    [
      '@babel/preset-typescript', // 引用Typescript插件
      {
        allExtensions: true, // 支持所有文件扩展名，否则在vue文件中使用ts会报错
      },
    ],
    "@vue/cli-plugin-babel/preset",
    'es2015'
  ],
  plugins: [
    "@vue/babel-plugin-jsx",
    "@babel-plugin-transform-vue-jsx",
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
  ]
}
