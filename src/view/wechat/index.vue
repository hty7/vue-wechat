<template>
  <div class="wechat">
    <div v-if="isWXLogin" class="wechat-box">
      <wx-chat-side-bar class="wechat-box-sidebar"></wx-chat-side-bar>
      <wx-chat-list class="wechat-box-list"></wx-chat-list>
      <wx-chat-content class="wechat-box-content"></wx-chat-content>
    </div>
    <wx-login :isWXLogin="isWXLogin" @getWxLoginUserInfo="getWxLoginUserInfo" v-else></wx-login>
  </div>
</template>

<script>
import WxLogin from './children/wxLogin'
import WxChatSideBar from './children/wxChatSideBar'
import WxChatList from './children/wxChatList'
import WxChatContent from './children/wxChatContent'
import {mapGetters, mapActions} from 'vuex'
import {matchRegDbrackets} from '@/utils/regular'
import {getWxUserInfo, checkWebSync, getWebWXSync, getWxBatchGetContact} from '@/service/modules/wx'
export default {
  components: {
    WxLogin, WxChatList, WxChatContent, WxChatSideBar
  },
  data: () => ({}),
  computed: {
    ...mapGetters(['isWXLogin', 'hasCheckLoading', 'loginWxUserInfo', 'chatUserList', 'activeIndex', 'activeUser', 'userChatLog', 'activeMessageList'])
  },
  created () {
    if (this.isWXLogin) this.getWxLoginUserInfo()
  },
  methods: {
    ...mapActions(['getWxContact']),
    // 初始化
    load (res) {
      let chatUserList = this.chatUserList
      res.forEach(el => {
        let hasItem = chatUserList.find(item => { return el.NickName === item.NickName })
        if (!hasItem) {
          chatUserList.push(el)
        }
      })
      this.$store.commit('SET_CHATUSERLIST', chatUserList)
      this.$store.commit('SET_ACTIVEUSER', chatUserList[0])
    },
    async getWxLoginUserInfo () {
      let LoginInit = JSON.parse(this.getLocalStorage('loginInit'))
      let urlContrnt = {
        r: ~new Date().getTime(),
        lang: 'zh_CN',
        pass_ticket: LoginInit.passTicket
      }
      let params = {
        BaseRequest: {
          DeviceID: 'e' + ('' + Math.random().toFixed(15)).substring(2, 17),
          Sid: LoginInit.wxsid,
          Skey: LoginInit.skey,
          Uin: LoginInit.wxuin
        }
      }
      let res = await getWxUserInfo(urlContrnt, params)
      if (res.BaseResponse && res.BaseResponse.Ret === 1101) {
        this.$store.commit('SET_WXLOGINSTATUS', false)
        return
      }
      if (res.BaseResponse && res.BaseResponse.Ret === 0) {
        this.$store.commit('SET_LOGINWXUSERINFO', res)
        this.setLocalStorage('synckey', res.SyncKey)
        this.setLocalStorage('loginWxuserInfo', res)
        this.checkWebSync() // 启动心调检测
        await this.getWxContact()
        await this.load(res.ContactList)
        this.getWxBatchGetContact(res.ChatSet, res.ContactList)
      }
    },
    // 获取聊天会话列表
    // recentUser 最近联系人
    // recentUserList 最近联系人列表
    async getWxBatchGetContact (recentUser, recentUserList) {
      let recentUserNameList = null
      if (recentUser) {
        recentUserNameList = recentUser.split(',')
      }
      if (recentUserNameList.length > recentUserList.length) {
        recentUserNameList = recentUserNameList.slice(recentUserList.length)
        let LoginInit = JSON.parse(this.getLocalStorage('loginInit'))
        let urlContrnt = {
          type: 'ex',
          r: new Date().getTime()
        }
        let params = {
          BaseRequest: {
            DeviceID: 'e' + ('' + Math.random().toFixed(15)).substring(2, 17),
            Sid: LoginInit.wxsid,
            Skey: LoginInit.skey,
            Uin: LoginInit.wxuin
          },
          Count: recentUserNameList.length,
          List: recentUserNameList.map(item => { return {EncryChatRoomId: '', UserName: item} })
        }
        let res = await getWxBatchGetContact(urlContrnt, params)
        if (res.BaseResponse.Ret === 0) this.load(res.ContactList)
      }
    },
    // 心跳检测
    // window.synccheck={retcode:"0",selector:"2"}
    async checkWebSync () {
      let LoginInit = JSON.parse(this.getLocalStorage('loginInit'))
      let syncKeyList = JSON.parse(this.getLocalStorage('synckey')).List
      let newSyncKeyList = syncKeyList.map(item => {
        return item.Key + '_' + item.Val
      })
      let params = {
        lang: 'zh_CN',
        deviceid: 'e' + ('' + Math.random().toFixed(15)).substring(2, 17),
        r: new Date().getTime(),
        _: new Date().getTime(),
        sid: LoginInit.wxsid,
        uin: LoginInit.wxuin,
        skey: LoginInit.skey,
        synckey: newSyncKeyList.join('|')
      }
      checkWebSync(params).then(res => {
        let retcode = matchRegDbrackets(res)[0]
        let selector = matchRegDbrackets(res)[1]
        if (retcode === '"0"') {
          switch (selector) {
            case '"0"':
              this.checkWebSync()
              break
            case '"2"':
              this.getWebWXSync()
              break
            case '"4"':
              this.getWebWXSync()
              break
            default:
              this.$store.commit('SET_WXLOGINSTATUS', false)
              break
          }
        } else {
          this.$store.commit('SET_WXLOGINSTATUS', false)
        }
      })
    },
    // 获取微信新消息
    async getWebWXSync () {
      let LoginInit = JSON.parse(this.getLocalStorage('loginInit'))
      let syncKey = JSON.parse(this.getLocalStorage('synckey'))
      let urlContrnt = {
        sid: LoginInit.wxsid,
        lang: 'zh_CN',
        skey: LoginInit.skey,
        pass_ticket: LoginInit.passTicket
      }
      let params = {
        BaseRequest: {
          DeviceID: 'e' + ('' + Math.random().toFixed(15)).substring(2, 17),
          Sid: LoginInit.wxsid,
          Skey: LoginInit.skey,
          Uin: LoginInit.wxuin
        },
        SyncKey: syncKey
      }
      let res = await getWebWXSync(urlContrnt, params)
      this.setLocalStorage('synckey', res.SyncCheckKey)
      if (res.AddMsgCount) {
        let wxContactList = JSON.parse(this.getLocalStorage('wxContact'))
        res.AddMsgList.forEach(item => {
          if (item.Content || item.MsgType === 47) {
            let chatUserList = this.chatUserList
            let hasNewUserInfo = null
            let hasUser = null
            if (item.FromUserName === this.loginWxUserInfo.User.UserName) {
              // 接受到自己微信信息
              hasNewUserInfo = wxContactList.find(el => {
                return el.UserName === item.ToUserName
              })
              hasUser = chatUserList.findIndex(el => {
                return el.UserName === item.ToUserName
              })
            } else {
              // 接受到别人微信信息
              hasNewUserInfo = wxContactList.find(el => {
                return el.UserName === item.FromUserName
              })
              hasUser = chatUserList.findIndex(el => {
                return el.UserName === item.FromUserName
              })
            }
            if (hasNewUserInfo) {
              let activeIndex = this.activeIndex
              let userChatLog = this.userChatLog
              let activeMessageList = this.activeMessageList
              if (hasUser !== -1) {
                chatUserList.splice(hasUser, 1)
                if (activeIndex < hasUser) activeIndex += 1 // 有新信息用户置前，高亮节点下移
              } else {
                // 非用户列表用户，选中节点下移
                activeIndex += 1
              }
              if (this.activeUser.UserName === hasNewUserInfo.UserName) {
                activeIndex = 0 // 处于选中状态用户提前高亮
              } else {
                hasNewUserInfo.hadRead = false
              }
              chatUserList.unshift(hasNewUserInfo)
              chatUserList[0].newChat = item.Content
              if (!item.Content && item.MsgType === 47) chatUserList[0].newChat = '[收到了一个表情，请在手机上查看]' // 非系统内置表情
              if (item.MsgType === 10002) chatUserList[0].newChat = '[撤回一条信息]' // 信息被撤回处理
              if (item.MsgType === 49) chatUserList[0].newChat = '[文件]' // 收到文件
              chatUserList[0].time = this.setDateFormat(new Date(), 0, 'hh:mm')
              this.$store.commit('SET_CHATUSERLIST', chatUserList)
              this.$store.commit('SET_ACTIVEINDEX', activeIndex)
              if (!userChatLog[hasNewUserInfo.UserName]) userChatLog[hasNewUserInfo.UserName] = []
              if (item.MsgType === 10002) {
                // 信息被撤回，不入库处理
                const matchREG = /&lt;msgid&gt;(.+?)&lt;\/msgid/
                let msgid = null
                if (item.Content.match(matchREG)[1]) msgid = item.Content.match(matchREG)[1]
                userChatLog[hasNewUserInfo.UserName] = userChatLog[hasNewUserInfo.UserName].map(el => {
                  if (el.MsgId === msgid) el.recall = true
                  return el
                })
              } else {
                userChatLog[hasNewUserInfo.UserName].push(item)
              }
              this.$store.commit('SET_USERCHATLOG', userChatLog)
              if (this.activeUser.UserName === hasNewUserInfo.UserName) {
                activeMessageList = this.userChatLog[this.activeUser.UserName] ? this.userChatLog[this.activeUser.UserName] : []
                this.$store.commit('SET_ACTIVEMESSAGELIST', activeMessageList) // 更新高亮对话
              }
            }
          }
        })
      }
      this.checkWebSync()
    }
  }
}
</script>

<style lang="scss" scoped>
.wechat {
  &-box {
    display: flex;
    background: #27282c;
    color: #fff;
    &-sidebar {
      flex: 0 0 80px;
      height: 648px;
    }
    &-list {
      flex: 0 0 280px;
      background-color: #303134;
      border: 1px #3c3c3c solid;
    }
    &-content {
      flex: 1;
    }
  }
}
</style>
