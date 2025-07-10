/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-06 14:29:11
 * @LastEditors: wys
 * @LastEditTime: 2022-07-14 14:24:11
 */

const state = {
  homeName: "首页名称",
  tunnelId:window.sessionStorage.getItem("tunnelId")||"",//首页区域列表id
}
const getter = {
  getHomeName: (state: any) => state.homeName,
  tunnelId:(state: any) => state.tunnelId,
}
const mutations = {
   // 设置当前仓库的属性
   TUNNEL_ID(state: any,tunnelId:any) {
    window.sessionStorage.setItem("tunnelId", tunnelId);
    state.tunnelId = tunnelId
  },
}
export default { namespaced: true, state, getter, mutations }
