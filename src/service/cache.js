import axios from 'axios'

// 数据存储
export const cache = {
  data: {},
  set (key, data, bol = false) {
    if (bol) {
      localStorage.setItem(key, JSON.stringify(data))
    } else {
      this.data[key] = data
    }
  },
  get (key, bol = false) {
    if (bol) {
      return JSON.parse(localStorage.getItem(key))
    } else {
      return this.data[key]
    }
  },
  clear (key, bol = false) {
    if (bol) {
      localStorage.removeItem(key)
    } else {
      delete this.data[key]
    }
  }
}

// 建立唯一的key值
function buildUrl (url, params = {}) {
  const sortedParams = Object.keys(params).sort().reduce((result, key) => {
    result[key] = params[key]
    return result
  }, {})

  url += `?${JSON.stringify(sortedParams)}`
  return url
}

// 缓存,建议只给get加缓存
export default (options = {}) => config => {
  const { url, method, params, data } = config
  const { local = false } = options
  // 建立索引
  let index
  if (method === 'get') {
    index = buildUrl(url, params)
  } else {
    index = buildUrl(url, data)
  }
  const indexData = index + '-data'
  let response = cache.get(indexData, local)
  let responsePromise = cache.get(index)
  if (response) {
    return Promise.resolve(JSON.parse(JSON.stringify(response))) // 对象是引用，为了防止污染数据源
  } else if (!responsePromise) {
    responsePromise = (async () => {
      try {
        const response = await axios.defaults.adapter(config)
        cache.set(indexData, response, local)
        return Promise.resolve(JSON.parse(JSON.stringify(response))) // 同时发送多次一样的请求，没办法防止污染数据源，只有业务中去实现
      } catch (reason) {
        cache.clear(index, local)
        cache.clear(indexData)
        return Promise.reject(reason)
      }
    })()

    // put the promise for the non-transformed response into cache as a placeholder
    cache.set(index, responsePromise)
  }
  return responsePromise
}
