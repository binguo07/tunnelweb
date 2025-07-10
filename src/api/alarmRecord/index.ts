import $axios from "../../utils/http"
import { IGetEventRecords,IResetFanErrorStatus,IKeywordSerch} from "./interface"
//告警记录查询
export const getProjectEventRecords = function(obj:IGetEventRecords){
    return $axios("/auth/monitor/getProjectEventRecords", "GET", obj)
}
//解除告警
export const resetFanErrorStatus = function(obj:IResetFanErrorStatus){
    return $axios("/auth/monitor/resetFanErrorStatus", "GET", obj)
}
// 模糊查询
export const keywordSerch = function (obj: IKeywordSerch): Promise<any> {
  return $axios("/auth/monitor/fuzzySearchByProject", "GET", obj)
}



