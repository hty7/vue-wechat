<template>
  <div class="chat-session-sidebar">
    <div class="chat-session-sidebar-search">
      <v-autocomplete
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        v-model="select"
        cache-items
        class="mx-3"
        hide-no-data
        hide-details
        label="搜索"
        item-text="name"
        item-value="symbol"
        solo-inverted
      >
        <template slot="no-data">
          <v-list-tile>
            <v-list-tile-title>
              搜索
              <strong>Cryptocurrency</strong>
            </v-list-tile-title>
          </v-list-tile>
        </template>
        <template slot="selection" slot-scope="{ item, selected }">
          <v-chip :selected="selected" color="blue-grey" class="white--text">
            <v-icon left>mdi-coin</v-icon>
            <span v-text="item.NickName"></span>
          </v-chip>
        </template>
        <template slot="item" slot-scope="{ item, tile }">
          <v-list-tile-avatar color="indigo" class="headline font-weight-light white--text">
            {{ item.NickName.charAt(0) }}
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.NickName"></v-list-tile-title>
            <v-list-tile-sub-title v-text="item.remarkName"></v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon>mdi-coin</v-icon>
          </v-list-tile-action>
        </template>
      </v-autocomplete>
    </div>
    <div class="chat-session-sidebar-bar">
      <div ref="chatUserList" class="chat-session-sidebar-list"  v-show="selectSideMenu === 1">
        <div ref="chatUserListItem">
          <div v-for="(item, index) in chatUserList" :key="index" :class="['chat-item', activeIndex === index?'activeChat':'']" @click="toggleChat(item, index)">
            <div class="badge" v-if="item.hadRead === false"></div>
            <div class="time">
              <span>{{item.time}}</span>
            </div>
            <div class="avatar">
              <img :src="baseURL + item.HeadImgUrl" alt="" class="img">
            </div>
            <div class="userinfo">
              <h3 class="nickName">
                <span class="nickName_text" v-html="item.RemarkName? item.RemarkName:item.NickName"></span>
              </h3>
              <p class="msg">
                {{item.newChat}}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="chat-session-sidebar-list" v-show="selectSideMenu === 2">
        <div :class="['contact-item', item.isTitle?'list-title':'']" v-for="(item, index) in userMemberList" :key="index" @click="toggleChat(item, 0, 1)">
          <h4 class="title" v-if="item.isTitle">{{item.titleName}}</h4>
          <div class="avatar" v-if="!item.isTitle">
            <img v-lazy="baseURL + item.HeadImgUrl" alt="" class="img" style="width: 32px;height: 32px;">
          </div>
          <div class="userinfo" v-if="!item.isTitle">
            <h3 class="nickname">
              <span class="nickname_text" v-html="item.RemarkName? item.RemarkName:item.NickName"></span>
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  components: {
  },
  data: () => ({
    isLoading: false,
    items: [],
    search: null,
    select: null
  }),
  computed: {
    ...mapGetters(['selectSideMenu', 'chatUserList', 'userMemberList', 'redirectUriType', 'activeIndex', 'activeMessageList', 'userChatLog']),
    baseURL () {
      return this.redirectUriType ? '/wx2' : '/wx1'
    }
  },
  watch: {
    search (val) {
      console.log(val)
      if (this.items.length > 0) return
      this.isLoading = true
      let newUserMemberList = this.userMemberList
      let result = val ? newUserMemberList.filter(this.createFilter(val)) : newUserMemberList
      this.items = result
      console.log(result)
      this.isLoading = false
    }
  },
  methods: {
    ...mapActions(['updateWxUserMember', 'setWxMsgStatus']),
    myScrollTop (el) {
      this.$nextTick(() => {
        this.$refs[el].scrollTop = 0
      })
    },
    // 获取单一聊天记录
    toggleChat (el, key, type) {
      let chatUserList = this.chatUserList
      let activeMessageList = this.activeMessageList
      if (type) {
        let selectUser = chatUserList.find(item => { return el.NickName === item.NickName })
        if (!selectUser) {
          chatUserList.unshift(el)
        } else {
          let hasUser = chatUserList.findIndex(item => {
            return el.NickName === item.NickName
          })
          chatUserList.splice(hasUser, 1)
          chatUserList.unshift(selectUser)
        }
        this.$store.commit('SET_SELECTSIDEMENU', 1)
        this.myScrollTop('chatUserList')
      }
      this.$store.commit('SET_ACTIVEUSER', el)
      this.$store.commit('SET_ACTIVEINDEX', key)
      activeMessageList = this.userChatLog[el.UserName] ? this.userChatLog[el.UserName] : []
      chatUserList[key].hadRead = true
      this.$store.commit('SET_CHATUSERLIST', chatUserList)
      this.$store.commit('SET_ACTIVEMESSAGELIST', activeMessageList)
      if (chatUserList[key].hadRead === false) this.setWxMsgStatus()
    },
    createFilter (queryString) {
      return (filterMember) => {
        if (!filterMember.NickName) return false
        if (filterMember.RemarkName) return (filterMember.RemarkName.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
        return (filterMember.NickName.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-session-sidebar {
  &-search {
    padding: 10px 0;
  }
  .activeChat {
    background-color: #3b495c;
    color: #e0e0e0;
    box-shadow: 0px 1px 11px 0px rgba(4, 16, 34, 0.55);
  }
  &-list {
    height: 548px;
    overflow-y: auto;
    .contact-item {
      overflow: hidden;
      color: #989898;
      padding: 10px 18px 10px;
      border-bottom: 1px solid #1f2227;
      cursor: pointer;
    }
    .chat-item {
      overflow: hidden;
      padding: 12px 18px 11px;
      border-bottom: 1px solid #292c33;
      cursor: pointer;
      position: relative;
    }
    .list-title {
      padding: 0;
    }
    .badge {
      height: 6px;
      width: 6px;
      padding: 0px;
      position: absolute;
      left: 7px;
      top: calc(50% - 3px);
      border-radius: 50%;
      background: #ff5722;
    }
    .title {
      padding: 5px 18px;
      font-weight: 400;
      background: #292d32;
      font-size: 14px;
    }
    .time {
      float: right;
      font-size: 12px;
      text-align: right;
    }
    .avatar {
      float: left;
      margin-right: 10px;
      position: relative;
      .img{
        display: block;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        border: 1px #2a2d31 solid;
      }
    }
    .userinfo {
      .nickName {
        font-weight: 400;
        font-size: 12px;
        color: #e0e0e0;
        line-height: 20px;
      }
      .msg {
        width: 180px;
        height: 1.5em;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: normal;
      }
    }
  }
}
</style>
