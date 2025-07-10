/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-22 15:30:51
 * @LastEditors: wys
 * @LastEditTime: 2022-08-11 10:18:58
 */
export interface IProjectId {
  projectId: number
}
export interface IKeywordSerch {
  field: string
  value: string
  projectId: number
}
export interface IGetDeviceList {
  pageNumber: number
  pageSize: number
  orderParam: string | null
  order: string | null
  queryParam: string
  projectId: number
}
export interface ITunnelId {
  tunnelId: number
}

export interface IDeviceAndTunnelId {
  deviceTypeId: number|string
  tunnelId: number
}

export interface IdeviceTypeId {
  deviceTypeId: number|string
}

export interface IsetDeviceAttr {
  deviceId: number
  attrs: string
  type: number
  dealer: number
}
