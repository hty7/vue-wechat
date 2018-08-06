import App from './App'
import axios from './service/'
import router from './router'
import store from './store/'
import { sync } from 'vuex-router-sync'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueLazyLoad from 'vue-lazyload'
import VueI18n from 'vue-i18n'
import mixin from './mixin'
import * as directives from './directives'
import * as filters from './filters'
import * as methods from './utils/utils'
import 'vuetify/dist/vuetify.min.css'
import './plugins/toast/toast.css'
import { Cascader, DatePicker, MessageBox, Loading } from 'element-ui'
import 'babel-polyfill'
/* 平台国际语言静态字典 */
import LangEn from './lang/en'
import LangZhCHS from './lang/zhCHS'

Vue.config.productionTip = false
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$loading = Loading.service

// 注册插件
Vue.use(Vuetify)
Vue.use(VueLazyLoad, {
  preLoad: 1.3,
  error: 'static/images/404.png',
  loading: 'static/images/loading-spin.svg',
  attempt: 1
})
Vue.use(VueI18n)
Vue.use(Cascader)
Vue.use(DatePicker)

// 全局混入
Vue.mixin(mixin)

// 设置语言项
const i18n = new VueI18n({
  locale: 'zh',
  messages: {
    'en': LangEn,
    'zh': LangZhCHS
  }
})

// 注册指令&&过滤器&&公有方法
Object.keys(directives).forEach(k => Vue.directive(k, directives[k]))
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))
Object.keys(methods).forEach(k => { Vue.prototype[k] = methods[k] })

// 动态路由
sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  axios,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
