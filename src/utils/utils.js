/**
 * 存储localStorage
 */
export const setLocalStorage = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
export const getLocalStorage = name => {
  if (!name) return
  return window.localStorage.getItem(name)
}

/**
 * 删除localStorage
 */
export const removeLocalStorage = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}

/**
 * 设置sessionStorage
 */
export const setSessionStorage = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.sessionStorage.setItem(name, content)
}

/**
 * 获取sessionStorage
 */
export const getSessionStorage = name => {
  if (!name) return
  return window.sessionStorage.getItem(name)
}

/**
 * 删除sessionStorage
 */
export const removeSessionStorage = name => {
  if (!name) return
  window.sessionStorage.removeItem(name)
}

/**
 *  保存cookie
 */
export const setCookie = (name, value) => {
  let days = 30
  let exp = new Date()
  exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
}

/**
 *  获取cookie
 */
export const getCookie = (name, defaultValue) => {
  let arr = null
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  arr = document.cookie.match(reg)
  if (arr) {
    return unescape(arr[2])
  } else {
    return defaultValue
  }
}

/**
 *  删除cookie
 */
export const delCookie = (name) => {
  let exp = new Date()
  exp.setTime(exp.getTime() - 1)
  let cval = getCookie(name)
  if (cval !== null) document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
}

/**
 *  web sql database
 */
// if (!window.openDatabase) {
//   console.log('该浏览器不支持数据库')
//   return false
// } else {
//   /*
//   * 创建数据库
//   * openDatabase使用现有数据库或创建新数据库创建数据库对象
//   * (数据库名称, 版本号, 数据库的描述, 数据的大小, 回调函数)
//   */
//   let dataBase = window.openDatabase('tvi.db', '1.0', 'gisHeatMap', 10 * 1024 * 1024)
//   /*
//   * 创建数据表
//   * transaction访问数据库
//   * executeSql异步执行真实的SQL查询
//   * (查询的字符串, 插入到查询中问号所在处的字符串数据, 成功回调函数, 失败回调函数)
//   */
//   dataBase.transaction((tx) => {
//     tx.executeSql(
//       'create table if not exists TEMPLATE (template_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, template_name TEXT)',
//       [],
//       (res) => {
//         console.log('创建模板表成功')
//       },
//       (error) => {
//         console.log('创建模板表失败:' + error.message)
//       }
//     )
//   })
//   /*
//   * 数据增删查改
//   */
//   dataBase.transaction((tx) => {
//     tx.executeSql(
//       'insert into TEMPLATE (id, name) values(?, ?)',
//       ['1', 'YJ'],
//       (res) => {
//         console.log('添加数据成功')
//       },
//       (error) => {
//         console.log('添加数据失败:' + error.message)
//       }
//     )
//   })
//   dataBase.transaction((tx) => {
//     tx.executeSql(
//       'select * from TEMPLATE',
//       [],
//       (tx, res) => {
//         console.log('查询数据成功', res)
//       },
//       (error) => {
//         console.log('查询数据失败:' + error.message)
//       }
//     )
//   })
// }

/**
 *  获取浏览器配置语言
 */
export const getNavigatorLang = (language) => {
  let type = navigator.appName
  let lang = null
  if (type === 'Netscape') {
    lang = navigator.language // 获取非IE浏览器语言
  } else {
    lang = navigator.userLanguage // 获取IE5+浏览器语言
  }
  switch (lang) {
    case 'zh-CN':
      return 'zh'
    case 'en-US':
      return 'en'
    default:
      return 'zh'
  }
}

/*
* 日期格式化
* _this Data()
*/
export const setDateFormat = (_this, timeLong, cb) => {
  _this = new Date(_this.getTime() + timeLong * 24 * 60 * 60 * 1000)
  let o = {
    'M+': _this.getMonth() + 1,
    'd+': _this.getDate(),
    'h+': _this.getHours(),
    'm+': _this.getMinutes(),
    's+': _this.getSeconds(),
    'q+': Math.floor((_this.getMonth() + 3) / 3),
    'S': _this.getMilliseconds()
  }
  if (/(y+)/.test(cb)) cb = cb.replace(RegExp.$1, (_this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(cb)) {
      cb = cb.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return cb
}
