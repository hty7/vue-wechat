import axios from 'axios'

export const login = param => {
  return axios.post('/login/login', param)
}
export const logout = param => {
  return axios.post('/login/logout', param)
}
/* 用户管理模块 */
export const getUserList = params => {
  return axios.post('/system/userList', params)
}
/* 用户信息修改 */
export const updateUserData = params => {
  return axios.post('/system/updateUser', params)
}
/* 新增用户信息 */
export const addUserData = params => {
  return axios.post('/system/insertUser', params)
}
/* 删除用户信息 */
export const delUserData = params => {
  return axios.post('/system/deleteUser', params)
}
