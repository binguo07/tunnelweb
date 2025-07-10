import $axios from "../../utils/http"
import { IProjectId, IKeywordSerch,HealthTimingRecords,HealthRealSpaceSort,HealthRealSpaceSortCDN} from "./interface"
// 数据中心 查询设备类型
export const getAllDeviceTypesRecords = function (obj: IProjectId) {
  return $axios("/auth/monitor/getAllDeviceClazzByProjectId", "GET", obj)
}

// 获取区域名称
export const getAreaRecords = function (obj: IProjectId): Promise<any> {
  return $axios("/auth/monitor/getAllArea", "GET", obj)
}

// 设备编号
export const getequipmentNumberRecords = function (obj: IKeywordSerch) {
  return $axios("/auth/monitor/fuzzySearchByProject", "GET", obj)
}

// 时域排序
export const getHealthTimingRecords = function (obj: HealthTimingRecords) {
  return $axios("/spike/getHealthTimingChart", "GET", obj)
}
//时序排序（成德南）
export const getHealthTimingCDNRecords = function (obj: HealthTimingRecords) {
  return $axios("/spike/getHealthTimingChartCDN", "GET", obj)
}
// 空间排序边坡
export const getHealthRealSpaceSort = function (obj: HealthRealSpaceSort) {
  return $axios("/spike/queryHealthRealData", "GET", obj)
}
// 空间排序边坡成德南
export const getHealthRealSpaceSortCDN = function (obj: HealthRealSpaceSortCDN) {
  return $axios("/spike/queryHealthRealDataCDN", "GET", obj)
}

