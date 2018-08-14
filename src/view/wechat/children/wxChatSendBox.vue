/* 微信信息发送模块
 * YJ
 * 2018-08-08
*/
<template>
   <div class="chat-session-body-ft">
    <div class="emoji-box">
      <v-tabs v-model="activeEmoji" color="grey darken-3" dark slider-color="white">
        <v-tab key="1" ripple>qq表情</v-tab>
        <v-tab key="2" ripple>符号表情</v-tab>
        <v-tab-item key="1">
          <div class="qq-face">
            <a v-for="(item, key) in QQFaceListData" :title="item.name" :key="key" :class="['face', 'qqface'+item.id]" @click="selsectEmoji(item)"></a>
          </div>
        </v-tab-item>
        <v-tab-item key="2" style="background: #3a3a3a;">
          <div style="overflow-y: auto;height: 222px;overflow-x: hidden;">
            <div class="emoji-face">
              <a v-for="(item, key) in fhEmojoList" :title="item.name" :key="key" :class="['face', 'emoji'+key]" @click="selsectfhEmoji(item)"></a>
            </div>
          </div>
        </v-tab-item>
      </v-tabs>
    </div>
    <div class="topBar">
      <v-btn flat icon small color="grey darken-2" slot="activator">
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
import {QQFaceList, QQFaceMap, EmojiList} from '@/utils/dict'
export default {
  components: {
  },
  data: () => ({
    message: '',
    activeEmoji: 1
  }),
  computed: {
    ...mapGetters(['loginWxUserInfo', 'activeUser', 'userChatLog', 'chatUserList', 'activeMessageList']),
    QQFaceListData () {
      return QQFaceList.map(el => {
        return {name: el, id: QQFaceMap[el]}
      })
    },
    fhEmojoList () {
      return EmojiList.map(el => {
        return {name: el, id: QQFaceMap[`[${el}]`]}
      })
    }
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
  .emoji-box {
    position: absolute;
    left: 0;
    top: -270px;
    height: 270px;
  }
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
