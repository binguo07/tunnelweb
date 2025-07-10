/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-06 17:10:37
 * @LastEditors: wys
 * @LastEditTime: 2022-08-04 17:26:58
 */
import {
  ILogin,
  IGtDeviceList,
  IGetDeviceError,
  IDeviceId,
  IGetChartData,
  IGetProjectAlarmLatest,
} from "./interface"
import $axios from "../../utils/http"

// 登录
export const LoginFun = function (obj: ILogin): Promise<any> {
  return $axios("/login/checkUserPass", "POST", obj)
}
// 获取设备
export const getDeviceList = function (obj: IGtDeviceList): Promise<any> {
  return $axios("/auth/monitor/getProjectDevices", "GET", obj)
  // return $axios("/tunnelSpike/auth/monitor/getTunnelDevices", "GET", obj)
}
// 查看设备报警记录
export const getDeviceError = function (obj: IGetDeviceError): Promise<any> {
  return $axios("/auth/monitor/getFireAlarmByDevId", "GET", obj)
}
// 获取设备运行状态
export const getSamplingValues = function (obj: IDeviceId): Promise<any> {
  return $axios("/auth/monitor/getSamplingValues", "GET", obj)
}
// 获取设备曲线图数据
export const getChartData = function (obj: IGetChartData): Promise<any> {
  return $axios("/auth/monitor/getChartData", "GET", obj)
}
// 获取设备采样数据
export const findDeviceSamplingData = function (obj: {
  tunnelId: number,projectId:number
}): Promise<any> {
  return $axios("/auth/monitor/findDeviceSamplingData", "GET", obj)
}
// 查询今日数据
export const getMonitorSubarea = function (obj: IGtDeviceList): Promise<any> {
  return $axios("/auth/monitor/getMonitorArea", "GET", obj)
}
// 查询首页告警消息
export const getProjectAlarmLatest = function (
  obj: IGetProjectAlarmLatest
): Promise<any> {
  return $axios("/auth/monitor/getProjectAlarmLatest", "GET", obj)
}
// 解除告警信息
export const removeDeviceError = function (obj: IDeviceId): Promise<any> {
  return $axios("/auth/monitor/resetDeviceErrorStatus", "POST", obj)
}
// 获取设备属性
export const loadDeviceAttrs = function (obj: IDeviceId): Promise<any> {
  return $axios("/auth/monitor/loadDeviceAttrs", "POST", obj)
}
