// 全局混入模式
export default {
  methods: {
    // 判断元素是否具有权限
    hasPermission (id) {
      if (!id) return true
      let {permissionMap} = this.$store.state.common
      return permissionMap.find(el => { return el === id })
    }
  }
}
