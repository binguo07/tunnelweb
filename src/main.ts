/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-04 15:16:37
 * @LastEditors: wys
 * @LastEditTime: 2022-08-12 11:30:22
 */
import { createApp } from "vue"
import App from "./App.vue"
import router from "./routers/index"
const vueApp = createApp(App)
// 注册路由
vueApp.use(router)
import store from "./store/index"
// 注册仓库
vueApp.use(store)
import "@/utils/jsmpeg.min.js"
import "@/assets/mapboxModel/mapbox.js"
import ElementPlus from "element-plus"
import { ElMessage } from "element-plus"
import "@/assets/mapboxModel/mapbox.css"

import "element-plus/dist/index.css"
// 设置语言
import locale from 'element-plus/dist/locale/zh-cn.mjs';

// 引入自适应插件
import "./utils/rem"
vueApp.use(ElementPlus, {
  locale: locale,
})
// 引入iconfont图标
import "@/assets/font/iconfont.css"
import "@/assets/font/iconfont.js"
import "@/assets/css/reset.css"
// 引入公共样式
import "@/assets/css/common.css"
// 引入字体文件
// import "@/assets/fonts/googlefont.css"
// 引入PDF转换库
import "@/assets/js/jsPdf.debug.js"
// 引入canvas绘制页面库
import "@/assets/js/html2canvas.js"

// 导航守卫
router.beforeEach((to, from, next) => {
  const isLogin = JSON.parse(localStorage.getItem("userInfo") || "{}")
  if (isLogin.loginId) {
    next()
  } else {
    if (to.name != "login") {
      ElMessage.error('当前用户未登陆,即将跳转到登录页')
      setTimeout(() => {
        next( '/')
      }, 500);
    }else{
      next()
    }
  }
})

vueApp.mount("#app")