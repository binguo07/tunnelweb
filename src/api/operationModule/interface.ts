/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-22 15:30:51
 * @LastEditors: wys
 * @LastEditTime: 2022-07-22 17:29:02
 */

//查询操作日志
export interface IQuerySettingLog{
  pageNumber:string
  pageSize:string 
  queryParam:any 
  project:string 
}
//操作日志-获取项目下所有设备类别
export interface IGetAllDeviceClazzByProjectId{
  projectId:string 
}
