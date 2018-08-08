import axios from 'axios'
import store from '@/store'
let type = null
// 获取微信唯一uid
export const getUUID = params => {
  return axios.get('/login/jslogin', {params: params})
}
// 显示二维码
export const getQRcode = params => {
  return axios.get(`/login/qrcode/${params}`)
}
// 等待扫码登陆
export const waitScanCode = params => {
  return axios.get('/login/cgi-bin/mmwebwx-bin/login', {params: params})
}
// 版本1微信用户获取登录参数
export const getLoginMessage = params => {
  type = store.state.wx.redirectUriType
  return axios.get(`/cgi-bin/mmwebwx-bin/webwxnewloginpage?${params}`, {baseURL: type ? '/wx2' : '/wx1'})
}
// 登陆初始化
export const getWxUserInfo = (urlContrnt, params) => {
  type = store.state.wx.redirectUriType
  return axios.post(`/cgi-bin/mmwebwx-bin/webwxinit?r=${urlContrnt.r}&lang=${urlContrnt.lang}&pass_ticket=${urlContrnt.pass_ticket}`, params, {baseURL: type ? '/wx2' : '/wx1'})
}
// 获取微信图片
export const getUserHeadImg = params => {
  return axios.get(`${params}`, {baseURL: type ? '/wx2' : '/wx1'})
}
// 开启微信状态通知
export const setWxStatusNotify = (urlContrnt, params) => {
  return axios.post(`/cgi-bin/mmwebwx-bin/webwxstatusnotify?lang=${urlContrnt.lang}&pass_ticket=${urlContrnt.pass_ticket}`, params, {baseURL: type ? '/wx2' : '/wx1'})
}
// 获取微信联系人
export const getWxContact = params => {
  return axios.get('/cgi-bin/mmwebwx-bin/webwxgetcontact', {params: params, baseURL: type ? '/wx2' : '/wx1'})
}
// 发送消息
export const sendWxMsg = (urlContrnt, params) => {
  return axios.post(`/cgi-bin/mmwebwx-bin/webwxsendmsg?lang=${urlContrnt.lang}&pass_ticket=${urlContrnt.pass_ticket}`, params, {baseURL: type ? '/wx2' : '/wx1'})
}
// 心态检测
export const checkWebSync = params => {
  return axios.get('/cgi-bin/mmwebwx-bin/synccheck', {params: params, baseURL: type ? '/check2' : '/check1'})
}
// 获取新消息
export const getWebWXSync = (urlContrnt, params) => {
  return axios.post(`/cgi-bin/mmwebwx-bin/webwxsync?lang=${urlContrnt.lang}&pass_ticket=${urlContrnt.pass_ticket}&skey=${urlContrnt.skey}&sid=${urlContrnt.sid}`, params, {baseURL: type ? '/wx2' : '/wx1'})
}
// 已读标记
export const setWxMsgStatus = params => {
  return axios.post(`/cgi-bin/mmwebwx-bin/webwxstatusnotify`, params, {baseURL: type ? '/wx2' : '/wx1'})
}
// 获取聊天会话列表
export const getWxBatchGetContact = (urlContrnt, params) => {
  return axios.post(`/cgi-bin/mmwebwx-bin/webwxbatchgetcontact?type=ex&r=${urlContrnt.r}`, params, {baseURL: type ? '/wx2' : '/wx1'})
}
// 上传附件
export const uploadMedia = params => {
  return axios.post('/cgi-bin/mmwebwx-bin/webwxuploadmedia?f=json', params, {baseURL: type ? '/upload2' : '/upload1'})
}
// 发送图片
export const sendMsgImg = params => {
  return axios.post('/cgi-bin/mmwebwx-bin/webwxsendmsgimg?fun=async&f=json', params, {baseURL: type ? '/wx2' : '/wx1'})
}
// 语音接口
export const getWxVoice = params => {
  return axios.get(`/cgi-bin/mmwebwx-bin/webwxgetvoice?msgid=${params.msgid}&skey=${params.skey}`, {baseURL: type ? '/wx2' : '/wx1'})
}
// 微信登出
export const wxLogout = (urlContrnt, params) => {
  return axios.post(`/cgi-bin/mmwebwx-bin/webwxlogout?redirect=${urlContrnt.redirect}&type=${urlContrnt.type}&skey=${urlContrnt.skey}`, params, {baseURL: type ? '/wx2' : '/wx1'})
}
