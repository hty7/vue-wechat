<template>
  <div class="login-wrap">
    <transition name="slide-fade">
    <div class="wx-login">
      <div class="wx-login-qrcode" v-show="!hasScan">
        <div class="wx-invalid" v-show="wxInvalid" @click="refresh">
          <img src="static/images/refresh-34re.png" alt="更新" class="refresh">
        </div>
        <img :src="qrCodeUrl" class="img">
        <div>
          <p class="title">
            {{wxInvalid?'二维码失效，点击刷新':'使用手机微信扫码登陆'}}
          </p>
          <p class="desc">
            微信聊天会话需要先登陆
          </p>
        </div>
      </div>
      <div class="wx-login-avatar" v-show="hasScan">
        <img :src="avatar" alt=用户头像 class="img">
        <p class="desc">
            请在手机端确定登陆
        </p>
        <v-btn color="info" @click="toggleUser">切换账号</v-btn>
      </div>
    </div>
    </transition>
  </div>
</template>

<script>
import {getUUID, waitScanCode, getLoginMessage} from '@/service/modules/wx'
import {matchRegDQuotes, matchRegSpecialChar, matchRegQuestionMark, matchRegApostrophe} from '@/utils/regular'
export default {
  props: {
    isWXLogin: {
      type: Boolean,
      default: true
    }
  },
  data: function () {
    return {
      hasScan: false,
      uuid: null,
      qrCodeUrl: null,
      wxInvalid: false, // 微信是否失效
      avatar: ''
    }
  },
  created () {
    this.getUUID()
  },
  watch: {
    isWXLogin (newVal) {
      if (!newVal) {
        this.hasScan = false
        this.getUUID()
      }
    }
  },
  methods: {
    toggleUser () {
      this.hasScan = false
      this.getUUID()
    },
    refresh () {
      this.wxInvalid = false
      this.toggleUser()
    },
    // 获取唯一标识uuid
    async getUUID () {
      this.setLocalStorage('isWXLogin', false)
      let params = {
        appid: 'wx782c26e4c19acffb',
        redirect_uri: 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxnewloginpage',
        fun: 'new',
        lang: 'zh_CN',
        _: new Date().getTime()
      }
      let res = await getUUID(params)
      this.uuid = matchRegDQuotes(res)
      this.qrCodeUrl = `https://login.weixin.qq.com/qrcode/${this.uuid}`
      this.scanCode()
    },
    async scanCode () {
      let params = {
        loginicon: true,
        uuid: this.uuid,
        tip: 0,
        r: ~new Date().getTime(),
        _: new Date().getTime()
      }
      waitScanCode(params).then(res => {
        let code = matchRegSpecialChar(res)
        if (code === '400') {
          this.wxInvalid = true
          return
        }
        if (code === '200') {
          let redirectUriType = 1
          redirectUriType = (res.indexOf('https://wx.qq.com') !== -1) ? 0 : 1
          this.$store.commit('SET_REDIRECTURITYPE', redirectUriType)
          let redirectUri = matchRegDQuotes(res)
          let redirectUriParams = matchRegQuestionMark(redirectUri)
          let userInfo = {
            uuid: this.uuid,
            userAvatar: this.avatar,
            redirectUriParams: redirectUriParams
          }
          this.setLocalStorage('userInfo', userInfo)
          this.getLoginMessage(redirectUriParams)
          return
        }
        if (code === '201') {
          this.avatar = matchRegApostrophe(res)
          this.scanCode()
          this.hasScan = true
          return
        }
        if (code === '408') this.scanCode()
      })
    },
    async getLoginMessage (val) {
      let params = val + '&fun=new&version=v2'
      let res = await getLoginMessage(params)
      let xmlDom = new DOMParser().parseFromString(res, 'text/xml')
      let ret = xmlDom.getElementsByTagName('ret')[0].innerHTML
      let skey = xmlDom.getElementsByTagName('skey')[0].innerHTML
      let wxsid = xmlDom.getElementsByTagName('wxsid')[0].innerHTML
      let wxuin = xmlDom.getElementsByTagName('wxuin')[0].innerHTML
      let passTicket = xmlDom.getElementsByTagName('pass_ticket')[0].innerHTML
      let loginInit = {skey: skey, wxsid: wxsid, wxuin: wxuin, passTicket: passTicket}
      console.log(ret)
      if (ret === '0') {
        this.setLocalStorage('isWXLogin', true)
        this.$store.commit('SET_WXLOGINSTATUS', true)
        this.setLocalStorage('loginInit', loginInit)
        this.$emit('getWxLoginUserInfo', loginInit)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-wrap{
    display: block;
    width:100%;
    height:100%;
    .wx-login {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -190px;
      margin-top: -270px;
      border-radius: 4px;
      background-color: #fff;
      width: 380px;
      height: 540px;
      box-shadow: 0 2px 15px #3a3939;
      &-qrcode {
        position: relative;
        text-align: center;
        .wx-invalid {
          position: absolute;
          width: 270px;
          height: 270px;
          background: rgba(255, 255, 255, 0.9);
          margin: 0 56px;
          cursor: pointer;
          .refresh {
            position: absolute;
            left: 33%;
            top: 33%;
            height: 86px;
            width: 86px;
            margin: 0;
          }
        }
        img {
          display: block;
          width: 270px;
          height: 270px;
          margin: 42px auto 12px;
        }
        .title {
          font-size: 20px;
          color: #353535;
          margin-bottom: 25px;
        }
        .desc {
          color: #a3a3a3;
          font-size: 15px;
          padding: 0 40px;
          line-height: 2;
        }
      }
      &-avatar {
        margin-top: 85px;
        text-align: center;
        .img {
          width: 160px;
          height: 160px;
          border-radius: 4px;
          margin-bottom: 40px;
          border: 1px solid rgba(0, 0, 0, .1);
        }
        .toggle {
          width: 168px;
          margin: 60px 80px auto;
        }
      }
    }
  }
  /* 动画 */
  .slide-fade{
    position: absolute;
    transform: translate(-50%,-50%);
    left:70%;
    top:50%;
    opacity: 0;
  }
  .slide-fade-enter-active {
    transition: all 1.2s ease;
  }
  .slide-fade-leave-active {

    transition: all .1s cubic-bezier(2.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
  {
    transform: translate(-50%,-50%);
    left:70%;
    top:50%;
    opacity: 0;
  }
</style>
