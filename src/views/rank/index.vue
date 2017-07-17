<template>
  <div class="rank" ref="rank">
    <m-scroll v-show="topList.length" :list="topList" class="toplist" ref="topList">
      <ul>
        <li class="item" v-for="item in topList" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songList">
              <span>{{index + 1}}</span>
              <span>{{song.songname}} - {{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </m-scroll>
    <div class="loading-container" v-show="!topList.length">
      <m-loading></m-loading>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import {getTopList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import mScroll from 'components/m-scroll'
  import mLoading from 'components/m-loading'
  import {playListMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'
  import * as mutationTypes from 'store/mutation-types'

  export default {
    data() {
      return {
        topList: []
      }
    },
    mixins: [playListMixin],
    created() {
      this._getTopList()
    },
    methods: {
      _getTopList() {
        getTopList().then(res => {
          if (res.code === ERR_OK) {
            this.topList = res.data.topList
          }
        })
      },
      handlePlaylist(playList) {
        const bottom = playList.length ? '60px' : ''
        this.$refs.rank.style.bottom = bottom
        this.$refs.topList.refresh()
      },
      selectItem(item) {
        this.setTopList(item)
        this.$router.push({
          path: `/rank/${item.id}`
        })
      },
      ...mapMutations({
        setTopList: mutationTypes.SET_TOP_LIST
      })
    },
    components: {
      mScroll,
      mLoading
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $c-bg-h
          color: $c-theme-d
          font-size: $f-s
          .song
            no-wrap()
            line-height: 26px

    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
