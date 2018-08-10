<template>
  <div class="sidebar">
    <div class="sidebar-avatar">
      <v-avatar><img :src="userInfo.userAvatar" alt="John"></v-avatar>
    </div>
    <div class="sidebar-btn" v-for="item in sideMenu" :key="item.indexKey" @click="toggle(item.indexKey)">
      <v-btn fab dark small color="pink" v-show="selectSideMenu === item.indexKey">
        <v-icon dark>{{item.icon}}</v-icon>
      </v-btn>
      <v-btn flat icon color="pink" v-show="selectSideMenu !== item.indexKey">
        <v-icon dark>{{item.icon}}</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  components: {
  },
  data: () => ({
    sideMenu: [
      {icon: 'favorite', indexKey: 1},
      {icon: 'contacts', indexKey: 2},
      {icon: 'face', indexKey: 3},
      {icon: 'android', indexKey: 4},
      {icon: 'list', indexKey: 5}
    ]
  }),
  computed: {
    ...mapGetters(['selectSideMenu', 'userInfo'])
  },
  methods: {
    toggle (val) {
      this.$store.commit('SET_SELECTSIDEMENU', val)
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
