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
      <v-textarea value="The" height="68" no-resize persistent-hint solo></v-textarea>
      <div class="send-btn">
        <span>按下ctrl + enter发送信息</span><v-btn flat icon color="pink"><v-icon>send</v-icon></v-btn>
      </div>
    </div>
   </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  components: {
  },
  data: () => ({
  }),
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
