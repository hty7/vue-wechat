/* 微信信息发送模块
 * YJ
 * 2018-08-08
*/
<template>
   <div class="chat-session-body-ft">
    <div class="topBar">
      <v-btn flat icon small color="grey darken-2">
        <v-icon>face</v-icon>
      </v-btn>
      <v-btn flat icon small color="grey darken-2">
        <v-icon>unarchive</v-icon>
      </v-btn>
      <v-btn flat icon small color="grey darken-2">
        <v-icon>camera_alt</v-icon>
      </v-btn>
      <v-btn flat icon small color="grey darken-2">
        <v-icon>track_changes</v-icon>
      </v-btn>
    </div>
    <div class="my-message">
      <v-textarea v-model="message" height="68" no-resize persistent-hint solo @keyup.ctrl.enter.native="sendMessage"></v-textarea>
      <div class="send-btn">
        <span>按下ctrl + enter发送信息</span><v-btn flat icon color="pink" @click="sendMessage"><v-icon>send</v-icon></v-btn>
      </div>
    </div>
   </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import {sendWxMsg} from '@/service/modules/wx'
export default {
  components: {
  },
  data: () => ({
    message: ''
  }),
  computed: {
    ...mapGetters(['loginWxUserInfo', 'activeUser', 'userChatLog', 'chatUserList', 'activeMessageList'])
  },
  methods: {
    ...mapActions(['getWxUserInfo', 'updateWxUserMember']),
    // 发送信息
    async sendMessage () {
      if (this.message) {
        let LoginInit = JSON.parse(this.getLocalStorage('loginInit'))
        let urlContrnt = {
          lang: 'zh_CN',
          pass_ticket: LoginInit.passTicket
        }
        let ClientMsgId = new Date().getTime()
        let params = {
          BaseRequest: {
            DeviceID: 'e' + ('' + Math.random().toFixed(15)).substring(2, 17),
            Sid: LoginInit.wxsid,
            Skey: LoginInit.skey,
            Uin: LoginInit.wxuin
          },
          Msg: {
            ClientMsgId: ClientMsgId,
            Content: this.message,
            FromUserName: this.loginWxUserInfo.User.UserName,
            LocalID: ClientMsgId,
            ToUserName: this.activeUser.UserName,
            Type: 1
          },
          Scene: 0
        }
        let res = await sendWxMsg(urlContrnt, params)
        if (res.BaseResponse.Ret === 0) {
          let userChatLog = this.userChatLog
          let chatUserList = this.chatUserList
          let activeMessageList = this.activeMessageList
          let newMes = Object.assign(params.Msg, {MsgType: 1})
          if (!userChatLog[this.activeUser.UserName]) userChatLog[this.activeUser.UserName] = []
          userChatLog[this.activeUser.UserName].push(newMes)
          activeMessageList = userChatLog[this.activeUser.UserName] ? userChatLog[this.activeUser.UserName] : []
          this.$store.commit('SET_ACTIVEMESSAGELIST', activeMessageList)
          this.$store.commit('SET_USERCHATLOG', userChatLog)
          chatUserList[this.activeIndex].newChat = this.message
          chatUserList[this.activeIndex].time = this.setDateFormat(new Date(), 0, 'hh:mm')
          this.$store.commit('SET_CHATUSERLIST', chatUserList)
          this.message = null
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-session-body-ft {
  .topBar {
    height: 40px;
    padding: 0 17px;
  }
  .my-message {
    .send-btn {
      position: absolute;
      bottom: 10px;
      right: 20px;
      color: #616161;
    }
  }
}
// 重置vuetify样式
.v-btn--icon.v-btn--small {
  height: 25px;
  width: 25px;
}
</style>
<style lang="scss">
.theme--light .v-text-field--solo .v-input__slot {
  background: #27282c !important;
}
.theme--light .v-input:not(.v-input--is-disabled) textarea {
  color: rgb(233, 30, 99);
}
</style>
