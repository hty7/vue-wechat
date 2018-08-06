<template>
  <v-dialog v-model="dialogShow" :lazy="true" persistent max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-text-field label="名称" v-model="editedItem.userName"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md6>
              <v-text-field label="登陆账号" v-model="editedItem.loginName"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md6>
              <v-btn outline color="primary" v-if="!passwordEdit" @click="passwordEdit=true">修改密码</v-btn>
              <v-text-field label="登陆密码" v-model="passWord" append-icon="present_to_all" :append-icon-cb="randomPw" v-else></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md12>
              <v-text-field label="电话" v-model="editedItem.phoneNum"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md12>
              <v-text-field label="email" v-model="editedItem.email" :rules="emailRules"></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-tooltip top>
        <v-alert slot="activator" v-model="alertShow" type="success" transition="scale-transition" :dismissible="dismissible">
          请记住用户登陆密码：{{passWord}}
          <span style="float: right;" v-show="!dismissible"> 5秒后关闭 ({{timeOut}})</span>
        </v-alert>
        <span>关闭提醒后保存数据</span>
      </v-tooltip>
      <v-card-actions v-show="!alertShow">
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" flat @click.native="close">{{$t('buttom.cancel')}}</v-btn>
        <v-btn color="info darken-1" flat @click.native="save">{{$t('buttom.save')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialogShow: {
      type: Boolean,
      default: false
    },
    formTitle: {
      type: String,
      default: '新增用户'
    },
    editedItem: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data: () => ({
    passwordEdit: false, // 是否修改密码
    alertShow: false, // 是否显示密码确认提示
    timeOut: 0, // 倒计时
    dismissible: false, // 提示是否可以关闭
    passWord: null, // 用户密码
    cityList: [], // 城市列表
    districtList: [], // 行政区列表
    emailRules: [v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || '请输入有效邮箱地址'] // 邮箱验证
  }),
  watch: {
    editedItem  (newVal) {
      // 数据初始化
      if (newVal.userId) {
        this.passwordEdit = false
        this.passWord = null
        this.getCity(newVal.provId)
        this.getDistrict(newVal.cityId)
      } else if (!this.passWord) {
        this.passwordEdit = true
        this.passWord = Math.random().toString(36).substr(4)
      }
    },
    // 关闭密码提示后提交数据
    alertShow (newVal) {
      if (!newVal && this.timeOut === 5) {
        this.submitData()
      }
    }
  },
  created () {
  },
  computed: {
    hasProv () {
      return !this.editedItem.provId
    },
    hasCity () {
      return !this.editedItem.cityId
    }
  },
  methods: {
    randomPw () {
      this.passWord = Math.random().toString(36).substr(4)
    },
    close () {
      this.$emit('close')
    },
    save () {
      if (this.passWord) {
        this.alertShow = true
        this.timeOut = 0
        let timeInter = setInterval(() => {
          if (this.timeOut === 4) {
            clearInterval(timeInter)
            this.dismissible = true
          }
          this.timeOut += 1
        }, 1000)
        this.dismissible = false
      } else {
        this.submitData()
      }
    },
    submitData () {
      this.editedItem.passWord = this.passWord
      this.$emit('save', this.editedItem)
    }
  }
}
</script>

<style scoped>

</style>
