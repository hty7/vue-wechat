import axios from 'axios'

export const login = param => {
  return axios.post('/login/login', param)
}
export const logout = param => {
  return axios.post('/login/logout', param)
}
export const getUserList = param => {
  return axios.post('/user/list', param)
}
export const updateUserData = param => {
  return axios.post('/user/update', param)
}
