/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-20 10:41:45
 * @LastEditors: wys
 * @LastEditTime: 2022-07-21 16:19:44
 */
import { IqueryDeviceTitle,HealthRealBridge,DeviceSamplingData,FireAlarmLates,FanErrorStatus,CameraFLV} from "./interface"
import $axios from "../../utils/http"
// 获取设备类型和对应详细的设备信息
export const queryDeviceTitle = function (
  obj: IqueryDeviceTitle
): Promise<any> {
  return $axios("/auth/monitor/getTunnelDevicesInfo", "GET", obj)
}
//桥梁
export const getHealthRealBridge = function (obj: HealthRealBridge) {
  return $axios("/spike/queryHealthRealData", "GET", obj)
}
//k144视频接口
export const getCameraFLV = function (obj: CameraFLV) {
  return $axios("/spike/getCameraFLV", "GET", obj)
}
// 设备采样接口
export const findDeviceSamplingData = function (obj: DeviceSamplingData) {
  return $axios("/auth/monitor/findDeviceSamplingData", "GET", obj)
}

// 告警列表
export const getFireAlarmLates = function (obj: FireAlarmLates) {
  return $axios("/auth/monitor/getEventRecords", "GET", obj)
}
// 解除告警
export const resetFanErrorStatus = function (obj: FanErrorStatus) {
  return $axios("/auth/monitor/resetFanErrorStatus", "GET", obj)
}

export const callManualAlarm = function (obj: any) {
  return $axios("/alarm/send", "GET", obj)
}

