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
export default {
  components: {
    WxLogin, WxChatList, WxChatContent, WxChatSideBar
  },
  data: () => ({}),
  computed: {
    ...mapGetters(['isWXLogin'])
  },
  methods: {
    ...mapActions(['getWxUserInfo', 'updateWxUserMember']),
    async getWxLoginUserInfo () {
      await this.getWxUserInfo()
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
