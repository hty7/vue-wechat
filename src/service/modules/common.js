import axios from 'axios'

export const getProvince = params => {
  return axios.post('/system/provAll', params)
}

export const getCity = params => {
  return axios.post('/system/cityAllByProv', params)
}
export const getDistrict = params => {
  return axios.post('/system/distAllByCity', params)
}
export const getAllIndustry = params => {
  return axios.post('/system/industryAll')
}
export const getAllRole = params => {
  return axios.post('/system/roleList', params)
}
export const getRoleModules = params => {
  return axios.post('/system/modeleListByRoseId', params)
}
