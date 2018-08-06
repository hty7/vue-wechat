<template>
  <v-dialog v-model="dialogShow" max-width="300px" :lazy="true" persistent>
    <v-card>
      <v-card-title class="light-blue dark-3">
        <span class="headline white--text">
          <v-avatar class="indigo" size="38">
            <img v-if="accoutMes.avatar" :src="accoutMes.avatar" alt="">
            <v-icon v-else dark>account_circle</v-icon>
          </v-avatar>
        </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-text-field
                label="登陆账号"
                v-model="params.loginName"
                prepend-icon="perm_contact_calendar"
                :rules="nameRules"
                :counter="10"
                required
              >
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                label="登陆密码"
                v-model="params.passWord"
                :rules="passwordRules"
                prepend-icon="vpn_key"
                :append-icon="pwHide ? 'visibility_off' : 'visibility'"
                @click:append="pwHide = !pwHide"
                :type="pwHide ? 'password' : 'text'"
              >
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card-text>
      <v-alert v-model="alertShow" type="success" transition="scale-transition">
        账号密码成功，{{3 - timeOut}}秒后将重新登陆
      </v-alert>
      <v-card-actions v-show="!alertShow">
        <v-spacer></v-spacer>
        <v-btn color="red" flat @click.stop="close">关闭</v-btn>
        <v-btn color="primary" flat @click.stop="update">更新</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {updateUserData} from '@/service/modules/userInfo'
export default {
  props: {
    dialogShow: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    valid: true,
    pwHide: true,
    accoutMes: {
      name: 'John YJ',
      role: '超级管理员',
      des: 'Front-end development engineer',
      avatar: './static/images/avatar.jpg'
    },
    nameRules: [
      v => !!v || '请输入账号',
      v => v.length <= 10 || '账号必须小于10个字符'
    ],
    passwordRules: [
      v => !!v || '请输入密码',
      v => v.length >= 6 || '密码必须大于6个字符'
    ],
    alertShow: false,
    timeOut: 0
  }),
  computed: {
    params () {
      let userInfo = Object.assign({passWord: ''}, JSON.parse(this.getLocalStorage('userInfo')))
      return userInfo
    }
  },
  methods: {
    async update () {
      if (this.$refs.form.validate()) {
        try {
          await updateUserData(this.params)
          this.alertShow = true
          this.timeOut = 0
          let timeInter = setInterval(() => {
            if (this.timeOut === 2) {
              clearInterval(timeInter)
              window.location.reload()
              this.$router.push({path: '/login'})
              this.removeSessionStorage('isLogin')
            }
            this.timeOut += 1
          }, 1000)
        } catch (err) {
        }
      }
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-box {
  position: fixed;
  left: calc(50% - 50px);
  top: 50%;
  z-index: 10;
  .triangle-up {
    width: 0;
    height: 0;
    position: relative;
    left: 20px;
    top: -15px;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 15px solid #fff;
  }
}
</style>
