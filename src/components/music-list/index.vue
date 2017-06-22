<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <div class="text">随机播放全部</div>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <m-scroll class="list" :list="songs" :listen-scroll="true" :probe-type="3" ref="songList" @pos-scroll="posScroll">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <m-loading></m-loading>
      </div>
    </m-scroll>
  </div>
</template>
<script>
  import {prefixStyle} from 'common/js/dom'
  import mScroll from 'components/m-scroll'
  import mLoading from 'components/m-loading'
  import songList from 'components/song-list'
  import {mapActions} from 'vuex'
  import {playListMixin} from 'common/js/mixin'

  const RESERVED_HEIGHT = 40
  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')

  export default {
    data() {
      return {
        scrollY: 0
      }
    },
    mixins: [playListMixin],
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: () => []
      },
      title: {
        type: String,
        default: ''
      }
    },
    computed: {
      bgStyle() {
        return `background-image:url(${this.bgImage})`
      }
    },
    mounted() {
      this.bgImageHeight = this.$refs.bgImage.clientHeight
      this.minTransalteY = -this.bgImageHeight + RESERVED_HEIGHT
      this.$refs.songList.$el.style.top = `${this.bgImageHeight}px`
    },
    methods: {
      handlePlaylist(playList) {
        const bottom = playList.length ? '60px' : ''
        this.$refs.songList.$el.style.bottom = bottom
        this.$refs.songList.refresh()
      },
      posScroll(pos) {
        this.scrollY = pos.y
      },
      selectItem(song, index) {
        this.selectPlay({
          index,
          list: this.songs
        })
      },
      back() {
        this.$router.back()
      },
      random() {
        this.randomPlay(this.songs)
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    watch: {
      scrollY(val) {
        let translateY = Math.max(this.minTransalteY, val)
        let scale = 1
        let zIndex = 0
        let blur = 0
        let $bgImage = this.$refs.bgImage
        const percent = Math.abs(val / this.bgImageHeight)
        if (val > 0) {
          scale = 1 + percent
          zIndex = 10
        } else {
          blur = Math.min(20, percent * 20)
        }
        this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
        if (val < this.minTransalteY) {
          zIndex = 10
          $bgImage.style.paddingTop = 0
          $bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.$refs.playBtn.style.display = 'none'
        } else {
          $bgImage.style.paddingTop = '70%'
          $bgImage.style.height = 0
          this.$refs.playBtn.style.display = ''
        }
        $bgImage.style[transform] = `scale(${scale})`
        $bgImage.style.zIndex = zIndex
      }
    },
    components: {
      mScroll,
      mLoading,
      songList
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
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
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $f-l
      color: $c-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: relative
        bottom: 40px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $c-theme
          color: $c-theme
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
      .filter
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, .4)
    .bg-layer
      position: relative
      height: 100%
      background: $c-bg
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $c-bg
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
