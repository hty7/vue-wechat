/* 微信信息发送模块
 * YJ
 * 2018-08-08
*/
<template>
   <div class="chat-session-body-ft">
    <div class="emoji-box" v-show="emojiBoxShow">
      <v-tabs v-model="activeEmoji" color="grey darken-3" dark slider-color="white">
        <v-tab key="qqemoji" ripple>qq表情</v-tab>
        <v-tab key="fhemoji" ripple>符号表情</v-tab>
        <v-tab-item key="qqemoji">
          <div class="qq-face">
            <a v-for="(item, key) in QQFaceListData" :title="item.name" :key="key" :class="['face', 'qqface'+item.id]" @click="selsectEmoji(item.name)"></a>
          </div>
        </v-tab-item>
        <v-tab-item key="fhemoji" style="background: #3a3a3a;">
          <div style="overflow-y: auto;height: 222px;overflow-x: hidden;">
            <div class="emoji-face">
              <a v-for="(item, key) in fhEmojoList" :title="item.name" :key="key" :class="['face', 'emoji'+key]" @click="selsectfhEmoji(item)"></a>
            </div>
          </div>
        </v-tab-item>
      </v-tabs>
    </div>
    <div class="topBar">
      <v-btn flat icon small :color="emojiBoxShow?'pink':'grey darken-2'" @click="emojiBoxShow = !emojiBoxShow">
        <v-icon>face</v-icon>
      </v-btn>
      <el-upload
        style="display: inline-block;"
        ref="upload"
        action="/upload/cgi-bin/mmwebwx-bin/webwxuploadmedia?f=json"
        :show-file-list="false"
        :before-upload="handleBeforeUpload"
        multiple
        :with-credentials="true"
        :file-list="fileList">
        <v-btn flat icon small color="grey darken-2">
          <v-icon>unarchive</v-icon>
        </v-btn>
      </el-upload>
      <v-btn flat icon small color="grey darken-2">
        <v-icon>camera_alt</v-icon>
      </v-btn>
      <v-btn flat icon small color="grey darken-2">
        <v-icon>track_changes</v-icon>
      </v-btn>
    </div>
    <div class="my-message">
      <v-textarea v-model="message" height="68" no-resize persistent-hint solo @keyup.ctrl.enter.native="sendMessage" @click="emojiBoxShow = false"></v-textarea>
      <div class="send-btn">
        <span>按下ctrl + enter发送信息</span><v-btn flat icon color="pink" @click="sendMessage"><v-icon>send</v-icon></v-btn>
      </div>
    </div>
   </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import {sendWxMsg, uploadMedia, sendMsgImg} from '@/service/modules/wx'
import {QQFaceList, QQFaceMap, EmojiList, EmojiCodeMap} from '@/utils/dict'
export default {
  components: {
  },
  data: () => ({
    message: '',
    activeEmoji: 'qqemoji',
    emojiBoxShow: false,
    fileList: []
  }),
  computed: {
    ...mapGetters(['loginWxUserInfo', 'activeUser', 'userChatLog', 'chatUserList', 'activeMessageList', 'activeIndex']),
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
      this.emojiBoxShow = false
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
    },
    // 选择qq表情
    selsectEmoji (el) {
      if (!this.message) this.message = ''
      this.message += `[${el}]`
    },
    // 选择符号表情
    selsectfhEmoji (el) {
      if (!this.message) this.message = ''
      // 将表情插入文本中，并另存一份非编译表情文本
      this.message += EmojiCodeMap[el.id]
    },
    // 附件上传前出处理
    handleBeforeUpload (file) {
      let LoginInit = JSON.parse(this.getLocalStorage('loginInit'))
      let ext, mediatype
      ext = file.name.match(/.*\.(.*)/)
      if (ext) {
        ext = ext[1].toLowerCase()
      } else {
        ext = ''
      }
      switch (ext) {
        case 'bmp':
        case 'jpeg':
        case 'jpg':
        case 'png':
          mediatype = 'pic'
          break
        case 'mp4':
          mediatype = 'video'
          break
        default:
          mediatype = 'doc'
      }
      let uploadMediaRequest = JSON.stringify({
        BaseRequest: {
          DeviceID: 'e' + ('' + Math.random().toFixed(15)).substring(2, 17),
          Sid: LoginInit.wxsid,
          Skey: LoginInit.skey,
          Uin: LoginInit.wxuin
        },
        ClientMediaId: (Date.now() + Math.random().toFixed(3)).replace('.', ''),
        TotalLen: file.size,
        StartPos: 0,
        DataLen: file.size,
        MediaType: 4,
        UploadType: 2,
        FromUserName: this.loginWxUserInfo.User.UserName,
        ToUserName: this.activeUser.UserName
      })
      let data = file
      let form = new FormData()
      form.append('name', file.name)
      form.append('type', file.type)
      form.append('lastModifiedDate', new Date().toGMTString())
      form.append('size', file.size)
      form.append('mediatype', mediatype)
      form.append('uploadmediarequest', uploadMediaRequest)
      form.append('webwx_data_ticket', this.getCookie('webwx_data_ticket'))
      form.append('pass_ticket', LoginInit.passTicket)
      form.append('filename', data, {
        filename: file.name,
        contentType: file.type,
        knownLength: file.size
      })
      this.uploadMedia(form).then(res => {
        switch (mediatype) {
          case 'pic':
            this.sendMsgImg(res, JSON.parse(uploadMediaRequest).ClientMediaId)
            break
          case 'doc':
            // this.sendDoc(file, ext, res)
            break
          case 'video':
            break
        }
      })
      return false
    },
    async uploadMedia (params) {
      let res = await uploadMedia(params)
      return res
    },
    // 发送图片
    async sendMsgImg (data, clientMediaId) {
      let LoginInit = JSON.parse(this.getLocalStorage('loginInit'))
      let parmas = {
        BaseRequest: {
          DeviceID: 'e' + ('' + Math.random().toFixed(15)).substring(2, 17),
          Sid: LoginInit.wxsid,
          Skey: LoginInit.skey,
          Uin: LoginInit.wxuin
        },
        Msg: {
          ClientMediaId: (Date.now() + Math.random().toFixed(3)).replace('.', ''),
          Content: '',
          FromUserName: this.loginWxUserInfo.User.UserName,
          ToUserName: this.activeUser.UserName,
          LocalID: clientMediaId,
          MediaId: data.MediaId,
          Type: 3
        },
        Scene: 0
      }
      let res = await sendMsgImg(parmas)
      if (res.BaseResponse.Ret === 0) {
        let userChatLog = this.userChatLog
        let chatUserList = this.chatUserList
        let activeMessageList = this.activeMessageList
        if (!userChatLog[this.activeUser.UserName]) userChatLog[this.activeUser.UserName] = []
        userChatLog[this.activeUser.UserName].push({
          Content: '',
          FromUserName: this.loginWxUserInfo.User.UserName,
          ToUserName: this.activeUser.UserName,
          MsgId: res.MsgID,
          MsgType: 3,
          Status: 3
        })
        activeMessageList = userChatLog[this.activeUser.UserName] ? userChatLog[this.activeUser.UserName] : []
        this.$store.commit('SET_ACTIVEMESSAGELIST', activeMessageList)
        this.$store.commit('SET_USERCHATLOG', userChatLog)
        chatUserList[this.activeIndex].newChat = '[图片]'
        chatUserList[this.activeIndex].time = this.setDateFormat(new Date(), 0, 'hh:mm')
        this.$store.commit('SET_CHATUSERLIST', chatUserList)
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
    box-shadow: 5px -5px 6px 0px #1e1e1e;
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
