<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switch-wrapper">
        <m-switch
          :currentIndex="currentIndex"
          :items="switchText"
          @switch="switchItem"
        ></m-switch>
      </div>
      <div class="play-btn" @click="playRandom">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <m-scroll
          v-if="currentIndex === 0"
          :list="favoriteList"
          class="list-scroll"
          ref="favoriteListScroll"
        >
          <div style="padding: 20px 30px">
            <song-list
              :songs="favoriteList"
              @select="selectSong"
            ></song-list>
          </div>
        </m-scroll>
        <m-scroll
          v-else
          :list="playHistory"
          class="list-scroll"
          ref="playListScroll"
        >
          <div style="padding: 20px 30px">
            <song-list
              :songs="playHistory"
              @select="selectSong"
            ></song-list>
          </div>
        </m-scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result>
          {{noResultDesc}}
        </no-result>
      </div>
    </div>
  </transition>
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'
  import Song from 'common/js/song'
  import {playListMixin} from 'common/js/mixin'
  import mSwitch from 'components/m-switch'
  import mScroll from 'components/m-scroll'
  import songList from 'components/song-list'
  import noResult from 'components/no-result'

  export default {
    data() {
      return {
        currentIndex: 0,
        switchText: [{name: '我喜欢的'}, {name: '最近听的'}]
      }
    },
    mixins: [playListMixin],
    computed: {
      noResult() {
        return this.currentIndex === 0 ? !this.favoriteList.length : !this.playHistory.length
      },
      noResultDesc() {
        return this.currentIndex === 0 ? '暂无收藏歌曲' : '还没听过歌'
      },
      ...mapGetters([
        'favoriteList',
        'playHistory'
      ])
    },
    methods: {
      switchItem(index) {
        this.currentIndex = index
      },
      selectSong(song) {
        this.insertSong(new Song(song))
      },
      back() {
        this.$router.back()
      },
      playRandom() {
        let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
        if (!list.length) return
        list = list.map(song => new Song(song))
        this.randomPlay(list)
      },
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.listWrapper.style.bottom = bottom
        this.$refs.favoriteListScroll && this.$refs.favoriteListScroll.refresh()
        this.$refs.playListScroll && this.$refs.playListScroll.refresh()
      },
      ...mapActions([
        'insertSong',
        'randomPlay'
      ])
    },
    components: {
      mSwitch,
      mScroll,
      songList,
      noResult
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .user-center
    fixed-cover()
    z-index: 100
    background: $c-bg
    .back
      position: absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $f-xl
        color: $c-theme
    .switch-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid $c-text-l
      color: $c-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $f-xm
      .text
        display: inline-block
        vertical-align: middle
        font-size: $f-s
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
