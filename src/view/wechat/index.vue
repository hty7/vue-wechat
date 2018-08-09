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
import {getWxUserInfo, checkWebSync} from '@/service/modules/wx'
export default {
  components: {
    WxLogin, WxChatList, WxChatContent, WxChatSideBar
  },
  data: () => ({}),
  computed: {
    ...mapGetters(['isWXLogin', 'hasCheckLoading', 'chatUserList'])
  },
  created () {
    if (this.isWXLogin && !this.hasCheckLoading) {
      this.checkWebSync()
    }
  },
  methods: {
    ...mapActions(['updateWxUserMember']),
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
    async getWxLoginUserInfo ({commit}, param) {
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
        await this.load(res.ContactList)
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
