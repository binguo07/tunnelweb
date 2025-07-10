/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-20 10:41:50
 * @LastEditors: wys
 * @LastEditTime: 2022-07-20 10:46:04
 */
export interface IqueryDeviceTitle {
  tunnelId: number
}
export interface HealthRealBridge {
  tunnelId:number
}
export interface DeviceSamplingData {
  tunnelId:number
}

export interface FireAlarmLates {
  tunnelId:number
  pageNumber:number
  pageSize:number
}
export interface FanErrorStatus {
  recordId:number
  device_no:number
  loginId:number
  reason:string
}
export interface CameraFLV {
  tunnelId:number
}


