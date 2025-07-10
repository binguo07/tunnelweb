/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-06 14:02:25
 * @LastEditors: wys
 * @LastEditTime: 2022-07-20 14:16:06
 */
import Common from "./modules/common"
import Home from "./modules/Home"
import { createStore } from "vuex"
// 注册仓库
export default createStore({
  modules: {
    Common,
    Home,
  },
  state:{
    isUpdateReportList:false
  },
})
