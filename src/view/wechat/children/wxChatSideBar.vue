<template>
  <div class="sidebar">
    <div class="sidebar-avatar">
      <v-avatar><img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John"></v-avatar>
    </div>
    <div class="sidebar-btn">
      <v-btn flat icon color="pink">
        <v-icon dark>add</v-icon>
      </v-btn>
    </div>
    <div class="sidebar-btn">
      <v-btn fab dark small color="pink">
        <v-icon dark>favorite</v-icon>
      </v-btn>
    </div>
    <div class="sidebar-btn">
      <v-btn flat icon color="pink">
        <v-icon dark>edit</v-icon>
      </v-btn>
    </div>
    <div class="sidebar-btn">
      <v-btn flat icon color="pink">
        <v-icon dark>android</v-icon>
      </v-btn>
    </div>
    <div class="sidebar-btn">
      <v-btn flat icon color="pink">
        <v-icon dark>list</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  components: {
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
.sidebar {
  text-align: center;
  &-avatar {
    padding: 10px;
  }
  &-btn {
    padding: 8px;
  }
}
</style>
