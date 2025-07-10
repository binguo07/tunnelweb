/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-08-02 10:13:34
 * @LastEditors: wys
 * @LastEditTime: 2022-08-09 14:13:00
 */
import { ITunnelFk, IpageObj, IEditReport,K144ReportObj,MonitorReportObj } from "./interfece"
import $axios from "../../utils/http"
// 获取图表数据
export const getDataByTunnel = function (obj: ITunnelFk): Promise<any> {
  return $axios("/auth/detectReport/total/getDataByTunnel", "GET", obj)
}
export const getMonitorReportChart = function (obj: MonitorReportObj): Promise<any> {
  return $axios("/auth/detectReport/total/getMonitorReportChart", "GET", obj)
}
//获取报告表格数据
export const getK144ReportData = function (obj: K144ReportObj): Promise<any> {
  return $axios("/auth/detectReport/total/getK144ReportData", "GET", obj)
}
// 获取监测报告集合数据
export const getReportData = function (obj: IpageObj): Promise<any> {
  return $axios("/auth/detectReport/total/getReportData", "GET", obj)
}
// 提交报告
export const editReport = function (obj: IEditReport): Promise<any> {
  return $axios("/auth/detectReport/total/editReportById", "GET", obj)
}
