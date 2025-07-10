/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-22 15:30:51
 * @LastEditors: wys
 * @LastEditTime: 2022-07-22 17:29:02
 */

//告警管理-查询告警日志
export interface IGetEventRecords{
  pageNumber:string
  pageSize:string 
  orderParam:string
  order:string
  queryParam:any 
  tunnelId:string 
  status:string
}
//告警管理-解除告警
export interface IResetFanErrorStatus{
  recordId:string //记录ID号
  device_no:string //设备编号
  reason:string //解除原因
  loginId:string//登录ID号
}
//模糊查询
export interface IKeywordSerch {
  field: string
  value: string
  projectId: number
}
