interface IHour {
  hour: number | string
  minute: number | string
}
interface IData {
  b: Date
  c: Date
}
//  时间转换放在全局
export const TimestampFn = function (timestamp: string): string {
  const date = new Date(timestamp)
  const Y = date.getFullYear() + "-"
  const M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-"
  const D = date.getDate() + " "
  let h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":"
  let m =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":"
  let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
  const dateString = Y + M + D + h + m + s
  return dateString
}

export const formatDateTime = function (date: Date): string {
  if (!date) {
    return ""
  }
  let y = date.getFullYear()
  let m: number | string = date.getMonth() + 1
  m = m < 10 ? "0" + m : m
  let d: number | string = date.getDate()
  d = d < 10 ? "0" + d : d
  let h: number | string = date.getHours()
  h = h < 10 ? "0" + h : h
  let minute: number | string = date.getMinutes()
  minute = minute < 10 ? "0" + minute : minute
  let second: number | string = date.getSeconds()
  second = second < 10 ? "0" + second : second
  return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second
}

//时间返回的年月日
export const TimestampFn_specificDate = function (timestamp: string): string {
  const date: Date = new Date(timestamp)
  const Y = date.getFullYear() + "-"
  const M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-"
  const D = date.getDate() + " " //空字符串格式
  const dateString = Y + M + D
  return dateString
}
//返回小时和分
export const Timestamp_hourFn = function (timestamp: string): IHour {
  const date = new Date(timestamp)
  const Y = date.getFullYear() + "-"
  const M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-"
  const D = date.getDate() + " "
  let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
  let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
  const dateString = { hour: h, minute: m }
  return dateString
}
//返回小时和分
export const Timestamp_hourFn_Two = function (timestamp: string): string {
  const date = new Date(timestamp)
  const Y = date.getFullYear() + "-"
  const M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-"
  const D = date.getDate() + " "
  let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
  let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
  const dateString = h + ":" + m
  return dateString
}
//默认一天的时间
export const TimesnewDateFn = function (): IData {
  const end = new Date()
  const start = new Date()
  const startold = start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
  const startnew = new Date(startold)
  let data = {
    b: startnew,
    c: end,
  }
  return data
}
//默认时间3小时
export const TimesDateFn_threehours = function (): IData {
  const end = new Date()
  const start = new Date()
  const startold = start.setTime(start.getTime() - 10800000)
  const startnew = new Date(startold)
  let data = {
    b: startnew,
    c: end,
  }
  return data
}

// 默认最近五分钟
export const TimesDateFn_Fiveminutes = function (): IData {
  const end = new Date()
  const start = new Date()
  const startold = start.setTime(start.getTime() - 300000)
  const startnew = new Date(startold)
  let data = {
    b: startnew,
    c: end,
  }
  return data
}
//默认一天的时间从一天的开始时间计算
export const TimesnewDateFn_two = function (): IData {
  const end = new Date()
  let startnew = new Date(new Date(new Date().toLocaleDateString()).getTime())
  let data = {
    b: startnew,
    c: end,
  }
  return data
}
//默认一周的时间
export const TimesweekDateFn = function (): IData {
  const end = new Date()
  const start = new Date()
  const startold = start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
  const startnew = new Date(startold)
  let data = {
    b: startnew,
    c: end,
  }
  return data
}
//默认30天的时间
export const TimesmonthDateFn = function (): IData {
  const end = new Date()
  const start = new Date()
  const startold = start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
  const startnew = new Date(startold)
  let data = {
    b: startnew,
    c: end,
  }
  return data
}

//默认90天的时间

export const TimesninetyDateFn = function (): IData {
  const end = new Date()
  const start = new Date()
  const startold = start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
  const startnew = new Date(startold)
  let data = {
    b: startnew,
    c: end,
  }
  return data
}
//默认180天的时间
export const Times_halfayearDateFn = function (): IData {
  const end = new Date()
  const start = new Date()
  const startold = start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
  const startnew = new Date(startold)
  let data = {
    b: startnew,
    c: end,
  }
  return data
}
//默认365天的时间
export const Times_ayearDateFn = function (): IData {
  const end = new Date()
  const start = new Date()
  const startold = start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
  const startnew = new Date(startold)
  let data = {
    b: startnew,
    c: end,
  }
  return data
}

//把时间戳转成天
export const formatSeconds = function (value: number): string {
  let theTime: number = value / 1000 // 需要转换的时间秒
  let theTime1: number = 0 // 分
  let theTime2 = 0 // 小时
  let theTime3 = 0 // 天
  if (theTime > 60) {
    theTime1 = theTime / 60
    theTime = theTime % 60
    if (theTime1 > 60) {
      theTime2 = theTime1 / 60
      theTime1 = theTime1 % 60
      if (theTime2 > 24) {
        //大于24小时
        theTime3 = theTime2 / 24
        theTime2 = theTime2 % 24
      }
    }
  }
  let result = ""
  if (theTime > 0) {
    result = "" + theTime + "秒"
  }
  if (theTime1 > 0) {
    result = "" + theTime1 + "分" + result
  }
  if (theTime2 > 0) {
    result = "" + theTime2 + "小时" + result
  }
  if (theTime3 > 0) {
    result = "" + theTime3 + "天" + result
  }
  return result
}

//升级状态
export const myupgrade = function (status: number, result: number) {
  let name = "正在升级"
  let label = "未知"
  let labeltwo = "成功"
  let labelthree = "失败"
  if (status == 1) {
    return name
  } else {
    if ((result = 0)) {
      return label
    } else if ((result = 1)) {
      return labeltwo
    } else {
      return labelthree
    }
  }
}
//对登录返回信息进行加码
export const Loginplus = function (data: string): string {
  let Logindata_str = JSON.stringify(data)
  let Logindata_encode = encodeURIComponent(Logindata_str)
  return Logindata_encode
}
//对登录进行减码
export const Loginsub_code = function (data: string): string {
  let Logindata_decode = decodeURIComponent(data)
  let Logindata_obj = JSON.parse(Logindata_decode)
  return Logindata_obj
}
