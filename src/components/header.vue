<template>
  <v-toolbar app fixed clipped-left dark height="58" class="header">
    <v-toolbar-side-icon @click.stop="drawer" v-show="controlsOption.settingShow"></v-toolbar-side-icon>
    <v-spacer></v-spacer>
    <v-avatar class="indigo" size="38">
      <img v-if="accoutMes.avatar" :src="accoutMes.avatar" alt="">
      <v-icon v-else dark>account_circle</v-icon>
    </v-avatar>
    <v-menu :close-on-content-click="false" :nudge-width="200" v-model="menu">
      <v-btn flat small slot="activator" color="white">{{accoutMes.userName}}</v-btn>
      <v-card>
        <v-expansion-panel>
          <v-expansion-panel-content hide-actions>
            <div slot="header">{{accoutMes.roleName}}</div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img v-if="accoutMes.avatar" :src="accoutMes.avatar" alt="">
              <v-icon v-else dark>account_circle</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{accoutMes.userName}}</v-list-tile-title>
              <v-list-tile-sub-title>{{`${accoutMes.provName}/${accoutMes.cityName}/${accoutMes.distName}`}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-tooltip bottom>
                <v-btn slot="activator" flat icon color="blue" @click="showSettingPage">
                  <v-icon>settings</v-icon>
                </v-btn>
                <span>用户设置</span>
              </v-tooltip>
            </v-list-tile-action>
            <setting :dialogShow="settingPageShow" @close="settingPageShow=false"></setting>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-list>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon size="20">phone</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-sub-title>{{accoutMes.phoneNum}}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider inset></v-divider>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon size="20">mail</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-sub-title>{{accoutMes.email}}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <!-- <v-list>
          <v-list-tile>
            <v-list-tile-action>
              <v-switch v-model="hints" color="purple"></v-switch>
            </v-list-tile-action>
            <v-list-tile-title>{{$t('optionMessage.hints')}} ({{hints?$t('optionMessage.skin1'):$t('optionMessage.skin2')}})</v-list-tile-title>
          </v-list-tile>
          <v-list-tile>
            <v-btn-toggle mandatory v-model="icon">
              <v-btn flat value="zh">
                <span>中文</span>
                <v-icon>format_align_left</v-icon>
              </v-btn>
              <v-btn flat value="en">
                <span>English</span>
                <v-icon>
                  format_color_text
                </v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-list-tile>
        </v-list> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="menu = false">{{$t('buttom.cancel')}}</v-btn>
          <v-btn color="primary" flat @click="signOut">{{$t('buttom.signOut')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-toolbar>
</template>

<script>
import {mapGetters} from 'vuex'
import Setting from './setting'
export default {
  components: {
    Setting
  },
  data: () => ({
    icon: 'zh',
    fav: true,
    settingPageShow: false,
    menu: false,
    hints: false,
    accoutMes: {
      userName: 'John YJ',
      roleName: '超级管理员',
      des: 'Front-end development engineer',
      avatar: '/static/images/avatar.jpg',
      phoneNum: 19999999999,
      email: '110@qq.com',
      provName: '广东省',
      cityName: '广州市',
      distName: '天河区'
    },
    cellArea: ''
  }),
  watch: {
    hints (val) {
      this.$store.commit('SET_CONTROLSOPTION', {hints: val})
    },
    icon (val) {
      this.$i18n.locale = val
      this.setLocalStorage('I18N_LANG', val)
    }
  },
  created () {
    this.loadData()
    let lang = this.getLocalStorage('I18N_LANG')
    if (lang) {
      this.icon = lang
    } else {
      let defaultLang = this.getNavigatorLang()
      this.setLocalStorage('I18N_LANG', defaultLang)
      this.icon = defaultLang
    }
  },
  computed: {
    ...mapGetters(['controlsOption', 'userInfo'])
  },
  methods: {
    loadData () {
      let userInfo = JSON.parse(this.getLocalStorage('userInfo'))
      Object.assign(this.accoutMes, userInfo)
      if (!this.userInfo) this.$store.commit('GET_CURRENTDATA', userInfo)
    },
    drawer () {
      this.$store.commit('SET_CONTROLSOPTION', {drawer: !this.controlsOption.drawer})
    },
    showSettingPage () {
      this.settingPageShow = true
    },
    async signOut () {
      this.menu = false
      this.$router.push({path: '/login'})
      this.removeSessionStorage('isLogin')
      this.$toast('退出登陆成功')
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  background: rgba(0, 55, 115, 0.17) !important;
}
.marginleft-100 {
  margin-left: 100px;
}
</style>
