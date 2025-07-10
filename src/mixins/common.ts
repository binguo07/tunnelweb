/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-21 16:47:20
 * @LastEditors: wys
 * @LastEditTime: 2022-07-25 10:21:45
 */
import { ElMessageBox, ElMessage } from "element-plus"
import {
  PROJECTID,
  TUNNELID,
  DIVCIE_TYPE_FK,
  PROJECTNAME,
} from "../utils/enumeration";
import { removeDeviceError, findDeviceSamplingData } from "../api/home/index"
import {
  resetFanErrorStatus,
} from "../api/alarmRecord/index";
export const removeDeviceErrorFunc = function (recordId: string,device_no:string,valueDesc:string,userInfo:any): Promise<any> {
  return new Promise((resolve, reject) => {
    var parameter = {
      recordId: recordId,
      device_no: device_no,
      reason: valueDesc,
      loginId: userInfo.loginId+"",
      project: PROJECTNAME,
    };
    ElMessageBox.confirm("是否要解除当前告警")
      .then(() => {
        resetFanErrorStatus(
          parameter
        ).then((res:any) => {
          console.log(res)
          if (res.code == 200) {
            resolve(1)
            ElMessage.success(res.message)
          } else {
            ElMessage.error(res.message)
          }
        })
      })
      .catch(() => {
        reject(0)
      })
  })
}

// 获取设备采样数据
export const SamplingDatafn = function (tunnelId: number,projectId:number): Promise<any> {
  return new Promise((resolve, reject) => {
    findDeviceSamplingData({ tunnelId,projectId })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
