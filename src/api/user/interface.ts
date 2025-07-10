/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-22 15:30:51
 * @LastEditors: wys
 * @LastEditTime: 2022-07-22 17:29:02
 */
export interface IProjectId {
  projectId: number
}
export interface IKeywordSerch {
  field: string
  value: string
  projectId: number
}
export interface IGetDeviceList {
  pageNumber: number
  pageSize: number
  orderParam: string | null
  order: string | null
  queryParam: string
  projectId: number
}
//重置密码
export interface IUpdateUserPass{
  // loginUser:string
  oldPass:string
  newPass:string
  targetUser:string
}
//编辑用户信息
export interface IEditMessage{
  loginId:string
  message:string
  targetId:string
}
//新增用户信息
export interface IAddUseraddUser{
  loginId:string
  password:string 
  email:string
}
//删除用户
export interface IRemoveUser{
  loginId:string
}
//显示所有用户登录ID
export interface IAllUserLoginId{
  loginId:string
}
//查询用户信息
export interface IFindUser{
  pageNumber:string 
  pageSize:string
  loginUser:string 
  targetUser:string
}
//取当前登录用户信息
export interface ICheckUserPass{
  loginId:string 
  userPass:string 
}