import {getWxContact} from '@/service/modules/wx'
import * as types from '../mutation-types'
import {getLocalStorage, setLocalStorage} from '@/utils/utils'
const state = {
  isWXLogin: JSON.parse(getLocalStorage('isWXLogin')), // 用户微信登陆状态
  hasCheckLoading: 0, // 心跳是否正常
  loginWxUserInfo: JSON.parse(getLocalStorage('loginWxuserInfo')), // 微信用户信息
  wxUserTab: [], // 用户标签
  chatLogShow: false,
  redirectUriType: JSON.parse(getLocalStorage('redirectUriType')), // 重定向地址
  synckey: {},
  chatRecordList: [], // 聊天记录
  userMemberList: [], // 微信用户通讯录列表
  addressBookIndex: {}, // 微信用户通讯录索引
  chatUserList: [], // 侧边栏聊天客户
  activeUser: {
    HeadImgUrl: '/static/images/logo.png'
  }, // 高亮用户
  activeIndex: 0, // 聊天高亮节点
  activeMessageList: [
    {
      Content: 'dddddd',
      MsgType: 1,
      FromUserName: '@03acd75b7d9d33002c68fa7f4be7ebe1a8f403d62480a0de19976bbf5929f75a',
      ToUserName: '@fgghhhhh766'
    },
    {
      Content: 'dd会随机发货v决定能否vdddd',
      MsgType: 1,
      FromUserName: '@fgghhhhh766',
      ToUserName: '@03acd75b7d9d33002c68fa7f4be7ebe1a8f403d62480a0de19976bbf5929f75a'
    }
  ], // 当前聊天用户聊天记录
  userChatLog: {}, // 用户聊天记录列表
  startCheckWebSync: 0, // 启动微信心跳
  hasWxUserList: {}
}

const getters = {
  hasWxUserList: state => state.hasWxUserList,
  isWXLogin: state => state.isWXLogin,
  hasCheckLoading: state => state.hasCheckLoading,
  loginWxUserInfo: state => state.loginWxUserInfo,
  wxUserTab: state => state.wxUserTab,
  chatLogShow: state => state.chatLogShow,
  redirectUriType: state => state.redirectUriType,
  synckey: state => state.synckey,
  chatRecordList: state => state.chatRecordList,
  userMemberList: state => state.userMemberList,
  addressBookIndex: state => state.addressBookIndex,
  chatUserList: state => state.chatUserList,
  activeUser: state => state.activeUser,
  activeIndex: state => state.activeIndex,
  activeMessageList: state => state.activeMessageList,
  userChatLog: state => state.userChatLog,
  startCheckWebSync: state => state.startCheckWebSync
}

const actions = {
  // 获取微信通讯录
  async getWxContact ({commit}, param) {
    let LoginInit = JSON.parse(getLocalStorage('loginInit'))
    let params = {
      lang: 'zh_CN',
      pass_ticket: LoginInit.passTicket,
      r: new Date().getTime(),
      seq: 0,
      skey: LoginInit.skey
    }
    let res = await getWxContact(params)
    commit(types.SET_USERMEMBERLIST, res.MemberList)
  }
}

const mutations = {
  [types.SET_USERCHATLOG] (state, data) {
    state.userChatLog = data
  },
  [types.SET_UPDATEHASWXUSERLIST] (state, data) {
    state.userMemberList.forEach(el => {
      if (state.hasWxUserList[el.NickName]) {
        el.isSync = 1
      } else {
        el.isSync = 0
      }
    })
  },
  [types.GET_HASWXUSERLIST] (state, data) {
    data.forEach(e => {
      state.hasWxUserList[e.nickName] = e
    })
  },
  [types.GET_WXUSERTAB] (state, data) {
    state.wxUserTab = data
  },
  [types.SET_WXLOGINSTATUS] (state, data) {
    state.isWXLogin = data
    setLocalStorage('isWXLogin', data)
  },
  [types.SET_HASCHECKLOADING] (state, data) {
    state.hasCheckLoading = data
  },
  [types.SET_CHATLOGSHOW] (state, data) {
    state.chatLogShow = data
  },
  [types.SET_REDIRECTURITYPE] (state, data) {
    setLocalStorage('redirectUriType', data)
    state.redirectUriType = data
  },
  [types.SET_SYNCKEY] (state, data) {
    state.synckey = data
  },
  [types.GET_CHATRECORDS] (state, data) {
    if (data.current > 1) {
      state.chatRecordList.records.push(...data.records)
      state.chatRecordList.current = data.current
    } else {
      state.chatRecordList = data
    }
  },
  [types.SET_USERMEMBERLIST] (state, data) {
    let userMemberList = []
    data.forEach((el, index) => {
      if (el.SnsFlag) {
        if (state.hasWxUserList[el.NickName]) {
          el.isSync = 1
        } else {
          el.isSync = 0
        }
        if (el.StarFriend) {
          userMemberList.unshift(el)
        } else {
          userMemberList.push(el)
        }
      }
    })
    state.userMemberList = userMemberList
    userMemberList.forEach((e, index) => {
      state.addressBookIndex[e.NickName] = index
    })
    setLocalStorage('wxContact', userMemberList)
  },
  [types.SET_CHATUSERLIST] (state, data) {
    state.chatUserList = data
  },
  [types.SET_ACTIVEUSER] (state, data) {
    state.activeUser = data
  },
  [types.SET_ACTIVEINDEX] (state, data) {
    state.activeIndex = data
  },
  [types.SET_ACTIVEINDEX] (state, data) {
    state.activeIndex = data
  },
  [types.SET_ACTIVEMESSAGELIST] (state, data) {
    state.activeMessageList = data
  },
  [types.SET_LOGINWXUSERINFO] (state, data) {
    state.loginWxUserInfo = data
  },
  [types.START_CHECKWEBSYNC] (state, data) {
    state.startCheckWebSync = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
