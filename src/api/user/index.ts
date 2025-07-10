import $axios from "../../utils/http"
import { IProjectId, IKeywordSerch, IGetDeviceList,IUpdateUserPass,IEditMessage,IAddUseraddUser,IRemoveUser,IAllUserLoginId, IFindUser,ICheckUserPass} from "./interface"
// 用户管理-重置用户密码
export const updateUserPass = function (obj: IUpdateUserPass) {
    return $axios("/auth/user/updateUserPass", "GET", obj)
}
// 用户管理-编辑用户信息
export const editMessage = function (obj: IEditMessage) {
    return $axios("/auth/user/editMessage", "GET", obj)
}
// 用户管理-新增用户信息
export const addUser = function (obj: IAddUseraddUser) {
    return $axios("/auth/user/addUser", "GET", obj)
}
// 用户管理-删除用户
export const removeUser = function (obj: IRemoveUser) {
    return $axios("/auth/user/removeUser", "GET", obj)
}
// 用户管理-显示所有用户登录ID
export const AllUserLoginId = function (obj: IAllUserLoginId) {
    return $axios("/auth/user/AllUserLoginId", "GET", obj)
}
// 用户管理-查询用户信息
export const findUser = function (obj: IFindUser) {
    return $axios("/auth/user/findUser", "GET", obj)
}
// 用户管理-获取当前登录用户信息
export const checkUserPass = function (obj: ICheckUserPass) {
    return $axios("/auth/user/checkUserPass", "GET", obj)
}
// 模糊查询
export const keywordSerch = function (obj: IKeywordSerch) {
    return $axios("/auth/monitor/fuzzySearchByProject", "GET", obj)
}
// 根据条件获取设备列表数据
export const getDeviceList = function (obj: IGetDeviceList): Promise<any> {
    return $axios("/auth/monitor/queryProjectDevicesInfo", "GET", obj)
}

