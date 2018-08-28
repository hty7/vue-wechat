import {getRoleModules} from '@/service/modules/common'
import * as types from '../mutation-types'
const state = {
  permissionMap: []
}

const getters = {
  permissionMap: state => state.permissionMap
}

const actions = {
  async getRoleModules ({commit}, params) {
    let data = await getRoleModules(params)
    commit(types.GET_ROLEMODULES, data)
  }
}

const mutations = {
  [types.GET_ROLEMODULES] (state, data) {
    state.permissionMap = data.map(item => {
      return item.moduleId
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
