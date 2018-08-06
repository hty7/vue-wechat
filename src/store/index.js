import Vue from 'vue'
import Vuex from 'vuex'
import main from './modules/main'
import common from './modules/common'
import wx from './modules/wx'
import userInfo from './modules/userInfo'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    main,
    userInfo,
    common,
    wx
  }
})
