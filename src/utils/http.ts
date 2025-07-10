/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-06 13:58:31
 * @LastEditors: wys
 * @LastEditTime: 2022-08-10 15:25:58
 */

import axios, { AxiosRequestConfig, Method } from "axios"
import { ElMessage } from "element-plus"


export const request = (url: string, type: Method, data: object) => {
  
  return new Promise((resolve, reject) => {
    const service = axios.create({
      baseURL: window.requestConfig.base_url, // api 的 base_url
      // baseURL: process.env.VUE_APP_BASE,
      // baseURL: 'http://192.168.100.122:5566',
      // baseURL:'http://47.108.254.101:9528/slope-cdn',
      // baseURL: 'http://182.140.146.131:7777/tunnelSpike',
      // baseURL: 'http://192.168.100.250:5566',
      timeout: 80000, // request timeout
    })

    // request interceptor
    service.interceptors.request.use(
      (config: any) => {
        const token: string =
          JSON.parse(localStorage.getItem("userInfo") || '{}')?.userId ?? ""
        if (token) {
          config.headers["token"] = token

          config.headers.Authorization = +token
        }
        return config
      },
      (error) => {
        // Do something with request error
        console.log(error.msg, error) // for debug
        Promise.reject(error)
      }
    )

    // response interceptor
    service.interceptors.response.use(
      (response: any) => {
        return response.data
      },
      (error) => {
        console.log("err" + error) // for debug
        if (error.response.status == 403) {
          ElMessage.error(error.msg)
        } else {
          ElMessage.error("服务器请求错误，请稍后再试")
        }
        return Promise.reject(error)
      }
    )
    // 请求处理
    service({
      url: url,
      data: data,
      method: type,
      params: data,
    })
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default request
