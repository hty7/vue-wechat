<template>
  <div class="chat-session-body">
    <div class="chat-session-body-header">
      <wx-chat-header></wx-chat-header>
    </div>
    <div class="chat-session-body-bd">
      <div class="message_empty" v-if="!activeMessageList.length">暂无新消息</div>
      <div class="message" v-else ref="chatSessionMessage">
        <div v-for="(item, index) in activeMessageList" :key="index">
          <div class="clearfix">
            <div :class="['message-item', item.FromUserName !== loginWxUserInfo.User.UserName?'you':'me']">
              <img :src="baseURL + loginWxUserInfo.User.HeadImgUrl" class="avatar" v-if="item.FromUserName === loginWxUserInfo.User.UserName">
              <img :src="baseURL + activeUser.HeadImgUrl" class="avatar" alt="" v-else>
              <div class="chatcontent">
                <div class="bubble" :style="{backgroundColor: item.FromUserName !== loginWxUserInfo.User.UserName?'#fff':'#3b7abe', color: item.FromUserName !== loginWxUserInfo.User.UserName?'#000':'#fff'}">
                  <div v-show="item.recall" class="recall">信息已被撤回</div>
                  <!-- 1 文字 3 图片 34语音 47表情 -->
                  <div class="bubble-text" v-show="item.MsgType === 1">
                    <div class="plain">
                      <span v-html="item.Content"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-session-body-ft">
      <wx-chat-send-box></wx-chat-send-box>
    </div>
  </div>
</template>

<script>
import WxChatSendBox from './wxChatSendBox'
import wxChatHeader from './wxChatHeader'
import {mapGetters, mapActions} from 'vuex'
export default {
  components: {
    WxChatSendBox, wxChatHeader
  },
  data: () => ({
    userCardShow: false
  }),
  computed: {
    ...mapGetters(['isWXLogin', 'activeMessageList', 'loginWxUserInfo', 'redirectUriType', 'activeUser']),
    baseURL () {
      return this.redirectUriType ? '/wx2' : '/wx1'
    }
  },
  methods: {
    ...mapActions([])
  }
}
</script>

<style lang="scss" scoped>
.chat-session-body {
  &-header {
    position: relative;
    border-bottom: 1px solid #191919;
  }
  &-bd {
    position: relative;
    height: 478px;
    width: 100%;
    padding: 20px 0;
    overflow-y: auto;
    overflow-x: hidden;
    .message_empty {
      text-align: center;
      padding: 128px;
      color: #ccc;
      font-size: 13px;
    }
    .message {
      color: #2f2f2f;
      .me {
        float: right;
        text-align: right;
        clear: right;
        .voice {
          .iconfont {
            float: right;
          }
        }
      }
      .me {
        .bubble {
          &:after {
            content: '';
            position: absolute;
            right: -10px;
            top: 5px;
            border-width: 0px 0 13px 12px;
            border-style: solid;
            border-color: transparent transparent transparent #3b7abe;
          }
        }
        .avatar{
          float: right;
        }
      }
      .you {
        .bubble {
          &:before {
            content: '';
            position: absolute;
            left: -10px;
            top: 5px;
            border-width: 0px 12px 13px 0px;
            border-style: solid;
            border-color: transparent #ffffff transparent transparent;
          }
        }
      }
      &-item {
        width: 90%;
        padding: 0 28px;
        margin-bottom: 16px;
        float: left;
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          border: 1px #3e3e3e solid;
          float: left;
          margin: 5px 0;
          cursor: pointer;
        }
        .chatcontent {
          overflow: hidden;
          .bubble {
            max-width: 500px;
            min-height: 40px;
            display: inline-block;
            vertical-align: top;
            position: relative;
            text-align: left;
            font-size: 14px;
            border-radius: 5px;
            margin: 5px 10px;
            &-image {
              cursor: pointer;
              height: 120px;
              .custom-emoji {
                width: 60px;
              }
            }
            &-text {
              word-wrap: break-word;
              word-break: break-all;
              min-height: 25px;
              .plain {
                padding: 9px 13px;
              }
              .voice {
                padding: 10px 13px;
                width: 120px;
                max-width: 300px;
                cursor: pointer;
                position: relative;
              }
            }
            .recall {
              position: absolute;
              right: -110px;
              top: 10px;
              width: 100px;
              color: #b3b3b3;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
  &-ft {
    height: 118px;
    border-top: 1px solid #1b1b1b;
    position: relative;
  }
}
// 重置vuetify样式
.v-btn--floating.v-btn--small {
  height: 35px;
  width: 35px;
}
</style>
