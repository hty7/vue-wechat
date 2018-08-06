<template>
  <v-app  class="login">
    <v-jumbotron src="/static/images/login_bg.jpg" height="100%">
      <v-container grid-list-md style="height: 100%;">
        <v-layout row align-center justify-end style="height: 100%;">
          <v-flex xs12 sm4 md4>
            <v-card style="padding: 10px;" width="360">
              <v-card-media src="/static/images/login_bg.jpg" height="220px"></v-card-media>
              <v-card-title  primary-title>
                <div class="headline">移动蜂巢选址平台</div>
              </v-card-title>
              <v-card-text>
                <v-form v-model="valid" ref="form" lazy-validation>
                  <v-text-field
                    prepend-icon="perm_contact_calendar"
                    :label="$t('message.accout')"
                    v-model="params.userName"
                    :rules="nameRules"
                    :counter="10"
                    required>
                  </v-text-field>
                  <v-text-field
                    :label="$t('message.password')"
                    v-model="params.paasWord"
                    :rules="passwordRules"
                    prepend-icon="vpn_key"
                    :append-icon="pwHide ? 'visibility_off' : 'visibility'"
                    @click:append="pwHide = !pwHide"
                    :type="pwHide ? 'password' : 'text'"
                    required>
                  </v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn :loading="loading" block round color="light-blue darken-4" dark @click.native="login">{{$t('buttom.login')}}</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    gradient: 'to top right, rgba(63,81,181, .7), rgba(25,32,72, .7)',
    valid: true,
    show: false,
    pwHide: true,
    params: {
      userName: '',
      paasWord: '',
      verifiCode: null,
      isAgress: false
    },
    nameRules: [
      v => !!v || '请输入账号',
      v => v.length <= 10 || '账号必须小于10个字符'
    ],
    passwordRules: [
      v => !!v || '请输入密码',
      v => v.length >= 6 || '密码必须大于6个字符'
    ],
    verifiCodeRules: [
      v => !!v || '请输入验证码'
    ],
    loading: false
  }),
  computed: {
  },
  methods: {
    async login () {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          this.setSessionStorage('isLogin', true)
          this.$router.push({path: '/'})
          this.$toast('登陆成功')
        } catch (err) {
          this.$toast(err.data)
        } finally {
          this.loading = false
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login {}
#particles-js {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 99%;
}
</style>
