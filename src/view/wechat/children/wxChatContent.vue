<template>
  <div class="chat-session-body">
    <div class="chat-session-body-header">
      <v-toolbar dark color="grey darken-4" height="56">
        <v-toolbar-title class="white--text">YJ</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn fab dark small color="primary">
          <v-icon dark>remove</v-icon>
        </v-btn>
        <v-btn fab dark small color="teal">
          <v-icon dark>list</v-icon>
        </v-btn>
        <v-btn fab dark small color="grey darken-3">
          <v-icon dark>edit</v-icon>
        </v-btn>
        <v-btn fab dark small color="grey darken-3">
          <v-icon dark>search</v-icon>
        </v-btn>
        <v-btn fab dark small color="grey darken-3">
          <v-icon dark>account_circle</v-icon>
        </v-btn>
      </v-toolbar>
    </div>
    <div class="chat-session-body-bd">
      ddd
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  components: {
  },
  data: () => ({
    userCardShow: false
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
.chat-session-body {
  &-header {
    position: relative;
    border-bottom: 1px solid #191919;
  }
}
// 重置vuetify样式
.v-btn--floating.v-btn--small {
  height: 35px;
  width: 35px;
}
</style>
