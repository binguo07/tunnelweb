import $axios from "../../utils/http"
import { IQuerySettingLog,IGetAllDeviceClazzByProjectId} from "./interface"
//操作日志查询
export const querySettingLog = function(obj:IQuerySettingLog){
    return $axios("/auth/monitor/querySettingLog", "GET", obj)
}
//操作日志-获取项目下所有设备类别
export const getAllDeviceClazzByProjectId = function(obj:IGetAllDeviceClazzByProjectId){
    return $axios("/auth/monitor/getAllDeviceClazzByProjectId", "GET", obj)
}


