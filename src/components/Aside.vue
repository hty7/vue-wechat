<template>
  <div ref="aside" :style="{width: width + 'px', right: -width + 'px'}" :class="classObj" :transition="(this.placement === 'left') ? 'slideleft' : 'slideright'">
    <!-- 显示详细信息用的 -->
    <div class="custom-aside-dialog" v-show="aside.show">
      <div class="custom-aside-content">
        <!-- 头部 -->
        <div class="custom-aside-header">
          <v-btn class="custom-close" flat icon color="pink" @click='close'>
            <v-icon>close</v-icon>
          </v-btn>
          <span style="font-size: 16px;color: #000;">{{header}}</span>
        </div>
        <!-- 内容  -->
        <div class="custom-aside-body">
          <slot name="body"></slot>
        </div>
      </div>
    </div>
    <div style="position: absolute;top: 18%;left: -70px;">
      <slot name="side"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    aside: {
      type: Object,
      default: function (argument) {
        return {
          show: false
        }
      }
    },
    placement: {
      type: String,
      default: 'right'
    },
    header: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 320
    },
    onShow: {
      type: Function
    },
    onHide: {
      type: Function
    },
    detail: {
      type: Boolean,
      default: false
    },
    prefixCls: {
      type: String,
      default: 'custom'
    }
  },
  watch: {
    aside: {
      handler (newVal) {
        if (newVal.show) {
          this.$nextTick(() => {
            this.$refs.aside.style.right = 0
          })
        } else {
          this.$nextTick(() => {
            this.$refs.aside.style.right = -this.width + 'px'
          })
        }
      },
      deep: true
    }
  },
  computed: {
    classObj () {
      let {
        prefixCls,
        placement
      } = this
      let klass = {}
      klass[prefixCls + '-aside'] = true
      klass[prefixCls + '-aside-right'] = placement === 'right'
      klass[prefixCls + '-aside-left'] = placement === 'left'
      return klass
    }
  },
  methods: {
    close () {
      this.aside.show = false
    }
  }
}
</script>
<style lang="scss" scoped>
// 打开的动画
@keyframes slideright-in {
    0% {
        transform: translateX(100%);
        opacity: 0;
    }
    100% {
        transform: translateX(0);
        opacity: 1;
    }
}
.custom-aside {
  position: fixed;
  top: 58px;
  bottom: 0;
  z-index: 7;
  background: white;
  animation: slideright-in 0.3s;
  box-shadow: 0 0 15px rgba(0, 0, 0, .3);
  &-right {
    transition: all 0.3s cubic-bezier(.645, .045, .355, 1);
    left: auto;
    right: 0;
  }
  &:focus {
    outline: 0;
  }
  &-dialog {
    height: 100%;
    overflow: auto;
    .custom-aside-header {
      min-height: 10px;
      position: relative;
      border-bottom: solid 1px #eeece8;
      padding: 15px;
      color: #acaba7;
      text-align: left;
      .custom-aside-title {
        font-size: 12px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .custom-close {
        outline: 0;
        position: fixed;
        top: 50px;
        right: 10px;
        opacity: 0.8;
        z-index: 10;
        -webkit-appearance: none;
      }
    }
    .custom-aside-body {
      position: relative;
      padding: 15px;
    }
  }
}
</style>
