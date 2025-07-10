/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-10-17 09:27:23
 * @LastEditors: wys
 * @LastEditTime: 2022-10-17 09:50:34
 */
/// <reference types="vite/client" />

import { decalFragment } from 'babylonjs/Shaders/ShadersInclude/decalFragment'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare var require: any
// 声明在window挂载的对象
export declare global {
  interface Window {
    global_config: {
      BASE_URL: string
      SOCKET_URL: string
      IMGURL_URL: string
      IMGURLLIGHT_URL: string
    }
    mapBoxConfig: any
  }
}
declare module 'element-plus/dist/locale/zh-cn.mjs' {
  // 根据实际导出的内容声明类型
  const localeData: any;
  export default localeData;
}
export let mapboxgl: any
declare let mapBoxConfig: any
declare let mapboxgl: any
declare var require: any
