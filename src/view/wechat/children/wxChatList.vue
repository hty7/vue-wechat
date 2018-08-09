<template>
  <div class="chat-session-sidebar">
    <div class="chat-session-sidebar-search">
      <v-autocomplete
        :items="items"
        :search-input.sync="search"
        v-model="select"
        cache-items
        class="mx-3"
        hide-no-data
        hide-details
        label="Search"
        solo-inverted
      ></v-autocomplete>
    </div>
    <div class="chat-session-sidebar-bar">
      <div ref="chatUserList" class="chat-session-sidebar-list">
        <div ref="chatUserListItem">
          <div v-for="(item, index) in chatUserList" :key="index" :class="['chat-item', activeIndex === index?'activeChat':'']">
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
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  components: {
  },
  data: () => ({
    items: [],
    search: null,
    select: null
  }),
  computed: {
    ...mapGetters(['isWXLogin', 'chatUserList', 'redirectUriType', 'activeIndex']),
    baseURL () {
      return this.redirectUriType ? '/wx2' : '/wx1'
    }
  },
  methods: {
    ...mapActions(['getWxUserInfo', 'updateWxUserMember'])
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
