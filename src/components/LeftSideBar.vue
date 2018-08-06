<template>
  <div class="left-side text-xs-center">
    <div class="left-side-item" v-for="(item, key) in listData" :key="key" :class="item.action == chartsType?'active':''">
      <v-btn :color="item.color" fab dark small @click="toggerCharts(item.action)">
        <v-icon>{{item.icon}}</v-icon>
      </v-btn><br>
      <span>{{item.name}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    listData: {
      type: Array,
      default: function () { return [] }
    },
    chartsType: {
      type: String,
      default: '0'
    }
  },
  data: () => ({
  }),
  computed: {
  },
  created () {
  },
  methods: {
    toggerCharts (action) {
      this.$emit('toggerCharts', action)
    }
  }
}
</script>
<style lang="scss" scoped>
.left-side {
  // position: fixed;
  // right: 20px;
  // top: 18%;
  .left-side-item {
    margin-bottom: 5px;
    span {
      font-weight: bold;
    }
  }
  .active {
    background: rgba(255, 255, 255, 0.6);
    padding: 5px 7px;
    -webkit-box-shadow: 0px 3px 3px #1f405ae6;
    box-shadow: -2px 0px 4px rgba(31, 64, 90, 0.3);
    border-radius: 10px 0 0 10px;
  }
}
</style>
