<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box
          placeholder="搜索歌曲"
          @query="onQueryChange"
          ref="searchBox"
        ></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <m-switch
          :items="switchItems"
          :currentIndex="switchIndex"
          @switch="switchItem"
        ></m-switch>
        <div class="list-wrapper">
          <m-scroll
            v-if="switchIndex === 0"
            :list="playHistory"
            class="list-scroll"
            ref="songListScroll"
          >
            <div style="padding: 20px 30px">
              <song-list
                :songs="playHistory"
                @select="selectSong"
              ></song-list>
            </div>
          </m-scroll>
          <m-scroll
            v-else
            :list="searchHistory"
            class="list-scroll"
            ref="searchListScroll"
            :refreshDelay="100"
          >
            <div style="padding: 20px 30px">
              <search-list
                :searches="searchHistory"
                @select="addQuery"
                @delete="deleteSearchHistory"
              ></search-list>
            </div>
          </m-scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <m-suggest
          :query="query"
          :showSinger="false"
          @beforeScroll="suggestScroll"
          @select="_suggestSelect"
        ></m-suggest>
      </div>
      <top-tip
        ref="topTip"
      >
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">添加成功</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>
<script>
  import {searchMixin} from 'common/js/mixin'
  import mSwitch from 'components/m-switch'
  import mScroll from 'components/m-scroll'
  import songList from 'components/song-list'
  import searchList from 'components/search-list'
  import topTip from 'components/top-tip'

  import {mapGetters, mapActions} from 'vuex'
  import Song from 'common/js/song'


  export default {
    data() {
      return {
        showFlag: false,
        switchItems: [{
          name: '最近播放'
        }, {
          name: '搜索历史'
        }],
        switchIndex: 0
      }
    },
    mixins: [searchMixin],
    computed: {
      ...mapGetters([
        'playHistory'
      ])
    },
    methods: {
      show() {
        this.showFlag = true
        this.$nextTick(() => {
          this.$refs.songListScroll && this.$refs.songListScroll.refresh()
          this.$refs.searchListScroll && this.$refs.searchListScroll.refresh()
        })
      },
      hide() {
        this.showFlag = false
      },
      switchItem(index) {
        this.switchIndex = index
      },
      _suggestSelect() {
        this.suggestSelect()
        this.showTip()
      },
      selectSong(song, index) {
        if (index) {
          this.insertSong(new Song(song))
          this.showTip()
        }
      },
      showTip() {
        this.$refs.topTip.show()
      },
      ...mapActions([
        'insertSong'
      ])
    },
    components: {
      mSwitch,
      mScroll,
      songList,
      searchList,
      topTip
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    fixed-cover()
    z-index: 200
    background: $c-bg
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $f-l
        color: $c-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $c-theme
    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden

    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $f-m
        color: $c-theme
        margin-right: 4px
      .text
        font-size: $f-m
        color: $c-text


</style>
