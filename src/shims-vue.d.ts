/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-04 13:31:27
 * @LastEditors: wys
 * @LastEditTime: 2022-07-19 16:21:19
 */
/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue"
  const component: DefineComponent<{}, {}, any>
  export default component
}

  declare global {
  interface Window{
    requestConfig: {
      base_url: string
      SOCKET_URL: string
      IMGURL_URL: string
    }
  }
  interface jessibuca
}
declare module 'element-plus/dist/locale/zh-cn.mjs' {
  // 根据实际导出的内容声明类型
  const localeData: any;
  export default localeData;
}

