/*
 * @Description: 公共变量
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-18 11:21:41
 * @LastEditors: wys
 * @LastEditTime: 2022-08-03 14:18:06
 */
// mapbox秘钥
export const ACCESS_TOKEN: string =
  "pk.eyJ1IjoibmFucWltaW5nIiwiYSI6ImNscHJvbXZwYjA3cGgyc241bnBobGR1NDAifQ.cY9mO5dBu0f88WFx_0wAZg"
// 隧道id,德会：18，成德南：1
export const TUNNELID: number = 1
// 项目id，德会：3，成德南：1
export const PROJECTID: number = 1
export const PROJECTNAME: string = "health_monitor"
//设备类型id
export const enum DIVCIE_TYPE_FK {
  SOIL = "Soil",//虚拟土壤监测
  WEATHER = "Weather",//气象
  PERAMBULATOR = "Perambulator",//激光测距仪
  MEMS = "MEMS",//MEMS
  MICRO_POWER_STATION =  "MicroPowerStation",//微电站
  PLOUGH = "Plough",//北斗
  TEAR_INSPECT = "Tear",//裂缝
  CAMERA = "Camera",//摄像机
  STRESS_INSPECT = "StressInspect",//应力监测
  PLATFORMMEMS = "PlatformMEMS",//虚拟MEMS
}