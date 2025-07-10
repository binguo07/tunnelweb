/*
 * @Description: 公共模块仓库
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-06 14:02:40
 * @LastEditors: wys
 * @LastEditTime: 2022-07-20 14:08:28
 */

interface funcValue {
  name: String | any
  value: Object
}
interface userInfos {
  userName: String
  userId: String | Number
}
const state = {
  userInfo: {
    name: "admin",
  },
  // 设备详细信息
  deviceInfos: {},
  // 是否打开设备详细弹窗
  isOpenDrawer: false,
  isUpdateReportList:false,
  canvasList:[]
}
const getters = {
  getUserInfo: (state: any) => state.userInfos,
  // 获取设备详细信息
  getDeviceInfos: (state: any) => state.deviceInfos,
  // 获取打开设备弹窗状态
  getIsOpenDrawer: (state: any) => state.isOpenDrawer,
  getIsUpdateReportList:(state:any)=>state.isUpdateReportList,
  getCanvasList:(state:any)=>state.canvasList,
}
const mutations = {
  // 设置当前仓库的属性
  SET_STATE_VALUE(state: any, value: funcValue) {
    state[value.name] = value.value
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
}
