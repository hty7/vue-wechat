<template>
  <div>
    <search @search="search"></search>
    <table-Data ref="table"></table-Data>
  </div>
</template>

<script>
import Search from './children/search'
import TableData from './children/tableData'
export default {
  components: {
    TableData, Search
  },
  data: () => ({}),
  computed: {
  },
  methods: {
    search (params) {
      params.currentPage = 1
      this.$refs.table.initialize(params)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
