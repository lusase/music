<template>
  <transition name="list-fade">
    <div class="play-list" v-show="showFlag" @click.self="hide">
      <div class="list-wrapper">
        <div class="header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <m-scroll :list="sequenceList" class="content" ref="listContent" :refreshDelay="100">
          <transition-group name="list" tag="ul">
            <li :key="song.id" ref="listItems" v-for="(song, index) in sequenceList" class="item" @click="selectItem(song, index)">
              <i class="current" :class="getCurrentIcon(song)"></i>
              <span class="text">{{song.name}}</span>
              <span @click.stop="toggleFavorite(song)" class="like">
                <i :class="getFavoriteIcon(song)"></i>
              </span>
              <span class="delete" @click.stop="deleteSong(song)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </m-scroll>
        <div class="operate">
          <div class="add" @click="showAddSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <m-confirm
        ref="mConfirm"
        title="确定要清空播放列表吗?"
        confirmText="清空"
        @confirm="cleanPlayList"
      ></m-confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>
<script>
  import {mapActions} from 'vuex'
  import mScroll from 'components/m-scroll'
  import mConfirm from 'components/m-confirm'
  import addSong from 'components/add-song'
  import {playMode} from 'common/js/config'
  import {playerMixin} from 'common/js/mixin'
  const modeTextMap = {
    [playMode.random]: '随机播放',
    [playMode.loop]: '循环播放',
    [playMode.sequence]: '顺序播放'
  }

  export default {
    data() {
      return {
        showFlag: false
      }
    },
    mixins: [playerMixin],
    computed: {
      modeText() {
        return modeTextMap[this.mode]
      }
    },
    watch: {
      currentSong(val) {
        if (val.id) {
          this.$nextTick(() => {
            this.scrollToCurrent()
          })
        }
      }
    },
    methods: {
      show() {
        this.showFlag = true
        this.$nextTick(() => {
          this.$refs.listContent.refresh()
          this.scrollToCurrent()
        })
      },
      hide() {
        this.showFlag = false
      },
      showConfirm() {
        this.$refs.mConfirm.show()
      },
      showAddSong() {
        this.$refs.addSong.show()
      },
      cleanPlayList() {
        this.deleteSongList()
        this.hide()
      },
      getCurrentIcon(item) {
        return this.currentSong.id === item.id ? 'icon-play' : ''
      },
      selectItem(item, index) {
        if (this.mode === playMode.random) {
          index = this.playList.findIndex(song => {
            return song.id === item.id
          })
        }
        this.setCurrentIndex(index)
        this.setPlayingState(true)
      },
      scrollToCurrent() {
        let index = this.sequenceList.findIndex(item => {
          return item.id === this.currentSong.id
        })
        this.$refs.listContent.scrollToElement(this.$refs.listItems[index], 500)
      },
      deleteSong(song) {
        this._deleteSong(song)
        if (!this.playList.length) {
          this.hide()
        }
      },
      ...mapActions({
        _deleteSong: 'deleteSong',
        deleteSongList: 'deleteSongList'
      })
    },
    components: {
      mScroll,
      mConfirm,
      addSong
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .play-list
    fixed-cover()
    z-index: 200
    background-color: $c-bg-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity .3s
      .list-wrapper
        transition: all .3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $c-bg-h
      .header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $c-theme-d
          .text
            flex: 1
            font-size: $f-m
            color: $c-text-l
          .clear
            .icon-clear
              font-size: $f-m
              color: $c-text-d
      .content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all .1s linear
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $f-s
            color: $c-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $f-m
            color: $c-text-d
          .like
            margin-right: 15px
            font-size: $f-s
            color: $c-theme
            .icon-favorite
              color: $c-theme-sub
          .delete
            font-size: $f-s
            color: $c-theme
      .operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $c-text-l
          border-radius: 100px
          color: $c-text-l
          .icon-add
            margin-right: 5px
            font-size: $f-xs
          .text
            font-size: $f-s
      .close
        text-align: center
        line-height: 50px
        background: $c-bg
        font-size: $f-xs
        color: $c-text-l
</style>
