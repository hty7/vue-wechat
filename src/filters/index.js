// 字符串转化为数值
export const toNumber = value => {
  if (value) return parseInt(value)
  return ''
}

export const setRoleType = value => {
  if (value) {
    switch (value) {
      case '1':
        return '超级管理员'
      case '2':
        return '采集员'
      case '3':
        return '区域管理员'
      case '4':
        return '用户'
    }
  } else {
    return ''
  }
}
export const setStar = (value, arg1, arg2) => {
  var result
  var addOne = true
  if (parseFloat(arg2) === parseInt(arg2)) {
    addOne = true
  } else {
    addOne = false
  }
  if (arg1 < arg2) {
    result = 'star'
  } else if (arg1 === Math.ceil(arg2)) {
    result = addOne ? 'star' : 'star_half'
  } else {
    result = 'star_border'
  }
  return result
}
