export const matchRegDQuotes = (val) => {
  // 获取双引号内的字段
  const matchREG = /\"(.+?)\"/
  let newVal = val.match(matchREG)[1]
  return newVal
}
export const matchRegSpecialChar = (val) => {
  const matchREG = /\=(.+?)\;/
  let newVal = val.match(matchREG)[1]
  return newVal
}
export const matchRegQuestionMark = (val) => {
  // 获取url问号后字段
  const matchREG = /\?(\S*)/
  let newVal = val.match(matchREG)[1]
  return newVal
}
export const matchRegApostrophe = (val) => {
  // 获取u单引号间字段
  const matchREG = /\'(.+?)\'/
  let newVal = val.match(matchREG)[1]
  return newVal
}
export const matchRegDbrackets = (val) => {
  const matchREG = /\"(.+?)\"/g
  let newVal = val.match(matchREG)
  return newVal
}
export const matchRegDBrackets = (val) => {
  // 获取双括号内的字段
  const matchREG = /\[(.+?)\]/g
  let newVal = val.match(matchREG)
  return newVal
}
export const replacehRegDBrackets = (val) => {
  // 获取双括号内的字段
  const matchREG = /\[(.+?)\]/g
  let newVal = val.replace(matchREG, ',')
  return newVal
}
