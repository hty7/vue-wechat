import axios from 'axios'
import router from '@/router/'

// axios 配置
axios.defaults.withCredentials = true
/**
 * http request    拦截器
 * token           判断是否存在token，如果存在的话，则http header加上token
 */
axios.interceptors.request.use(config => {
  return config
}, err => {
  return Promise.reject(err)
})

axios.interceptors.response.use(res => {
  if (res.status === 200) {
    if (res.data.state) {
      switch (res.data.state.code) {
        case 200:
          return res.data.data
        // 无权限
        case 401:
          router.push('/login')
          return Promise.reject(res.data.state.msg)
        // session过期或者未登陆
        case 403:
          router.push('/login')
          return Promise.reject(res.data.state.msg)
      }
    }
    return res.data
  }
  return Promise.reject(res.data)
}, err => {
  return Promise.reject(err)
})

export default axios
