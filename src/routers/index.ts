/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-05 10:41:22
 * @LastEditors: wys
 * @LastEditTime: 2022-08-03 11:25:50
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"

const routers: Array<RouteRecordRaw> = [
  // 登录
  {
    path: "/",
    name: "login",
    component: () => import("@/views/login.vue"),
  },
  // 二级导航
  {
    path: "/index",
    name: "index",
    component: () => import("@/views/index.vue"),
    children: [
      // 首页
      {
        path: "home",
        name: "首页",
        component: () => import("@/views/homeModule/home.vue"),
      },
      {
        path: "monitorConsole",
        name: "监控台",
        component: () => import("@/views/monitorModule/monitorConsole.vue"),
      },
      // 设备管理
      {
        path: "deviceManagement",
        name: "设备管理",
        component: () => import("@/views/deviceModule/deviceManagement.vue"),
      },
      {
        path: "userManagement",
        name: "用户管理",
        component: () => import("@/views/userModule/userManagement.vue"),
      },
      // 报警记录
      {
        path: "alarmRecord",
        name: "报警记录",
        component: () => import("@/views/alarmModule/alarmRecord.vue"),
      },
      // 数据中心
      {
        path: "recordsCenter",
        name: "数据中心",
        component: () => import("@/views/recordsModule/recordsCenter.vue"),
      },
      // 设备管理
      {
        path: "deviceManagement",
        name: "设备管理",
        component: () => import("@/views/deviceModule/deviceManagement.vue"),
      },
      // 监测报告
      {
        path: "monitoringReportList",
        name: "监测报告集合",
        component: () =>
          import("@/views/reportModule/monitoringReportList.vue"),
      },

      // 操作日志
      {
        path: "operationLog",
        name: "操作日志",
        component: () => import("@/views/operationModule/operationLog.vue"),
      },
    ],
  },
  // 监测报告集合
  {
    path: "/monitoringReport",
    name: "监测报告",
    component: () => import("@/views/reportModule/monitoringReport.vue"),
  },
]
// 暂时用hash模式，如果直接试用history会与服务器配合试用
const router = createRouter({
  history: createWebHashHistory(),
  routes: routers,
})

export default router
