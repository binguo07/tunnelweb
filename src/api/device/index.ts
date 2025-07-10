/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-22 15:30:44
 * @LastEditors: wys
 * @LastEditTime: 2022-08-12 14:39:53
 */
import $axios from "../../utils/http"
import {
  IProjectId,
  IKeywordSerch,
  IGetDeviceList,
  ITunnelId,
  IDeviceAndTunnelId,
  IdeviceTypeId,
  IsetDeviceAttr,
} from "./interface"
// 设备管理 查询设备类型
export const getAllDeviceTypes = function (obj: IProjectId): Promise<any> {
  return $axios("/auth/monitor/getAllDeviceClazzByProjectId", "GET", obj)
}
// 模糊查询
export const keywordSerch = function (obj: IKeywordSerch): Promise<any> {
  return $axios("/auth/monitor/fuzzySearchByProject", "GET", obj)
}
// 根据条件获取设备列表数据
export const getDeviceList = function (obj: IGetDeviceList): Promise<any> {
  return $axios("/auth/monitor/queryProjectDevicesInfo", "GET", obj)
}
// 获取区域名称
export const getMonitorArea = function (obj: IProjectId): Promise<any> {
  return $axios("/auth/monitor/getAllArea", "GET", obj)
}
// 获取当前隧道所有设备类型
export const getAllDeviceTypeByTunnelId = function (
  obj: ITunnelId
): Promise<any> {
  return $axios("/auth/monitor/getAllDeviceTypeByTunnelId", "GET", obj)
}

// 获取设备树形结构
export const getDevicesByType = function (
  obj: IDeviceAndTunnelId
): Promise<any> {
  return $axios("/auth/monitor/getDevicesByType", "GET", obj)
}
// 群控部分
export const getBatchAttrValue = function (obj: IdeviceTypeId): Promise<any> {
  return $axios("/auth/monitor/getBatchAttrValue", "GET", obj)
}

// 设置设备属性
export const setDeviceAttr = function (obj: IsetDeviceAttr): Promise<any> {
  return $axios("/auth/monitor/setDeviceAttrs", "POST", obj)
}
// 获取设备概览
export const getProjectDevicesInfo = function (obj: IProjectId): Promise<any> {
  return $axios("/auth/monitor/getProjectDevicesInfo", "GET", obj)
}
//获取树形设备列表用于群控
export const getAllDevicesTree = function (obj: IProjectId): Promise<any> {
  return $axios("/auth/monitor/getAllDevicesTree", "GET", obj)
}
