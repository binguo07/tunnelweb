/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-08-02 10:13:40
 * @LastEditors: wys
 * @LastEditTime: 2022-08-09 11:51:44
 */
export interface ITunnelFk {
  tunnelFk: number
  reportTime:string
}

export interface IpageObj {
  tunnelFk: number
  pageSize: number
  pageNumber: number
  reportStatus: number
  startTime: string | null | undefined
  endTime: string | null | undefined
}

export interface IEditReport{
  id:number
  comments:string
  loginId:string
}
export interface K144ReportObj{
  tunnelFk: number
  startTime: string | null | undefined
  endTime: string | null | undefined
}
export interface MonitorReportObj{
  tunnelFk: number
  startTime: string | null | undefined
  endTime: string | null | undefined
}

