/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-06 17:12:43
 * @LastEditors: wys
 * @LastEditTime: 2022-07-21 16:45:59
 */
// 登录
export interface ILogin {
  loginId: string
  userPass: string
}

// 获取设备
export interface IGtDeviceList {
  projectId: number
}
// 获取设备告警信息
export interface IGetDeviceError {
  pageNumber: number
  pageSize: number
  devId: number
}
// 传递设备id
export interface IDeviceId {
  deviceId: number
}
// 获取设备属性曲线图
export interface IGetChartData {
  startTime: string
  endTime: string
  deviceId: number
  sampleId: string
}
// 获取告警消息
export interface IGetProjectAlarmLatest {
  projectId: number
  count: number | null
}
