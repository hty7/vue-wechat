import {login, getUserList} from '@/service/modules/userInfo'
import * as types from '../mutation-types'
const state = {
  userList: {
    data: [],
    size: 10,
    currentPage: 1
  }
}

const getters = {
  userList: state => state.userList
}

const actions = {
  async loginTo ({commit}, params) {
    let data = await login(params)
    commit(types.GET_CURRENTDATA, data)
    return data
  },
  async getUserList ({commit}, params) {
    let data = await getUserList(params)
    commit(types.GET_USERLIST, data)
    return data
  }
}

const mutations = {
  [types.GET_CURRENTDATA] (state, data) {
  },
  [types.GET_USERLIST] (state, data) {
    state.userList = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
