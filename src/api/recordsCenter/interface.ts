/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-22 15:30:51
 * @LastEditors: wys
 * @LastEditTime: 2022-07-22 17:29:02
 */
export interface IProjectId {
    projectId: number
  }
  export interface IKeywordSerch {
    field: string
    projectId: number
    tunnelId:number
    clazzId:number
  }

  export interface SpikeRecord {
    deviceNo: string
    startTime:string
    endTime:string
  }
 
  export interface HealthTimingRecords {
    deviceNo: string
    startTime:string
    endTime:string
  }
  export interface HealthRealSpaceSort {
    tunnelId:number
  }
  export interface HealthRealSpaceSortCDN {
    tunnelId:number
  }
 
 