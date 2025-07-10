/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-06-06 10:10:21
 * @LastEditors: wys
 * @LastEditTime: 2022-07-07 14:45:26
 */

// rem等比适配配置文件
// 基准大小
const baseSize: number = 16
// 设置 rem 函数
function setRem() {
  // 当前页面屏幕分辨率相对于 1920宽的缩放比例，可根据自己需要修改
  const scale: number = document.documentElement.clientWidth / 1920
  // 设置页面根节点字体大小（“Math.min(scale, 2)” 指最高放大比例为2，可根据实际业务需求调整）
  document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + "px"
}
// 初始化
setRem()
// 改变窗口大小时重新设置 rem
window.onresize = function () {
  // 暂时不用当前插件
  setRem()
}
