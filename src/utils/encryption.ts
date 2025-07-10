/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-08-12 11:35:05
 * @LastEditors: wys
 * @LastEditTime: 2022-08-12 11:36:33
 */
const SM4 = require("gm-crypt").sm4
let sm4 = new SM4({
  //配置sm4参数
  key: "HENG2AN2WEN3YIN5", //这里这个key值是跟后端要的
  mode: "ecb", // 加密的方式有两种，ecb和cbc两种，也是看后端如何定义的，不过要是cbc的话下面还要加一个iv的参数，ecb不用
  cipherType: "base64", //
})

export const ENCRYPT = function (value: string): string {
  return sm4.encrypt(value)
}
