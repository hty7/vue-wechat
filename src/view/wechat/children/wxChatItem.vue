<template>
  <div>
    <template v-for="(item, index) in newMsg">
      <span v-html="item.value" :key="index" v-if="item.type === 1"></span>
      <img :class="['qqemoji', 'qqemoji' + filterEmoji(item.value)]" src="" :text="item.value" alt="" :key="index" v-else>
    </template>
  </div>
</template>

<script>
import {matchRegDBrackets, replacehRegDBrackets} from '@/utils/regular'
import {QQFaceMap, CodeEmojiMap} from '@/utils/dict'
export default {
  props: {
    // 原信息
    msg: {
      type: String,
      default: null
    }
  },
  data () {
    return {
    }
  },
  created () {
  },
  computed: {
    newMsg () {
      let newMsgEmoji = matchRegDBrackets(this.msg) // 获取qq表情
      let newMsgText = replacehRegDBrackets(this.msg).split(',') // 获取文本及符号表情
      let newMsgList = []
      let emojoNum = 0
      newMsgText.forEach(el => {
        if (el) {
          // 拆分文本中的符号表情
          let newEl = el.split('').map(item => {
            if (CodeEmojiMap[item]) return `<span class="emoji emoji${CodeEmojiMap[item]}"></span>`
            return item
          }).join('')
          newMsgList.push({value: newEl, type: 1}) // 插入文本
          if (newMsgText.length !== 1 && newMsgEmoji.length > emojoNum) newMsgList.push({value: newMsgEmoji[emojoNum], type: 2}) // 插入qq表情
        } else {
          if (newMsgEmoji.length > emojoNum) newMsgList.push({value: newMsgEmoji[emojoNum], type: 2}) // 插入qq表情
        }
        emojoNum += 1
      })
      return newMsgList
    }
  },
  methods: {
    filterEmoji (value) {
      if (value) {
        const matchREG = /\[(.+?)\]/
        let newVal = value.match(matchREG)
        if (newVal) {
          return QQFaceMap[newVal[1]]
        } else {
          return QQFaceMap[value]
        }
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
