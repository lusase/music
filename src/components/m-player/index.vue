<template>
  <div class="m-player" v-show="playList.length">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <div class="subtitle" v-html="currentSong.singer"></div>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="{pause: !playing}">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="player-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <m-scroll class="middle-r" :list="currentLyric && currentLyric.lines" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text" :class="{current:index===currentLineNum}" v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </m-scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{active:currentShow == 'cd'}"></span>
            <span class="dot" :class="{active:currentShow == 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{currentTime | songTime}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="progressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{currentSong.duration | songTime}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="{'icon-play':!playing,'icon-pause':playing}"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon" @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" :class="{pause: !playing}">
        </div>
        <div class="text">
          <div class="name" v-html="currentSong.name"></div>
          <div class="desc" v-html="currentSong.singer"></div>
        </div>
        <div class="control">
          <progress-circle :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini"
               :class="{'icon-play-mini': !playing,'icon-pause-mini': playing}"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <play-list ref="playList"></play-list>
    <audio ref="audio" :src="currentSong.url" @play="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'
  import mScroll from 'components/m-scroll'
  import progressBar from 'components/progress-bar'
  import progressCircle from 'components/progress-circle'
  import playList from 'components/play-list'
  import animations from 'create-keyframe-animation'
  import Lyric from 'lyric-parser'
  import {playerMixin} from 'common/js/mixin'
  import {playMode} from 'common/js/config'
  import {prefixStyle} from 'common/js/dom'

  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')
  export default {
    data() {
      return {
        songReady: false,
        currentTime: 0,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: ''
      }
    },
    mixins: [playerMixin],
    computed: {
      disableCls() {
        return this.songReady ? '' : 'disable'
      },
      percent() {
        return this.currentTime / this.currentSong.duration
      },
      ...mapGetters([
        'fullScreen',
        'playing',
        'currentIndex'
      ])
    },
    components: {
      mScroll,
      progressBar,
      progressCircle,
      playList
    },
    created() {
      this.touch = {}
      document.addEventListener('mousewheel', e => {
        if (this.playList && this.playList.length && !this.fullScreen) {
          if (e.wheelDelta > 0) {
            if (this.$refs.audio.volume < 1) {
              this.$refs.audio.volume += 0.02
            }
          } else {
            if (this.$refs.audio.volume > 0) {
              this.$refs.audio.volume -= 0.02
            }
          }
        }
      })
    },
    methods: {
      showPlayList() {
        this.$refs.playList.show()
      },
      middleTouchStart(e) {
        this.touch.start = true
        this.touch.startX = e.touches[0].pageX
        this.touch.startY = e.touches[0].pageY
      },
      middleTouchMove(e) {
        if (!this.touch.start) return
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaX) < Math.abs(deltaY)) return
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        const $lr = this.$refs.lyricList.$el
        const $ml = this.$refs.middleL
        $ml.style.opacity = 1 - this.touch.percent
        $ml.style[transitionDuration] = 0
        $lr.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
        $lr.style[transitionDuration] = 0
      },
      middleTouchEnd() {
        this.touch.start = false
        let offsetWidth
        const $lr = this.$refs.lyricList.$el
        const $ml = this.$refs.middleL
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            this.currentShow = 'cd'
          } else {
            offsetWidth = -window.innerWidth
          }
        }
        const time = 300
        $lr.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
        $lr.style[transitionDuration] = time + 'ms'
        $ml.style.opacity = this.currentShow === 'cd' ? 1 : 0
        $ml.style[transitionDuration] = time + 'ms'
      },
      back() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
      ready() {
        this.songReady = true
        this.savePlayHistory(this.currentSong)
      },
      error() {
        this.songReady = true
      },
      prev() {
        if (!this.songReady) return
        if (this.playList.length === 1) {
          this.loop()
          return
        } else {
          let index = this.currentIndex - 1
          if (index === -1) index = this.playList.length - 1
          this.setCurrentIndex(index)
          if (!this.playing) this.togglePlaying()
        }
        this.songReady = false
      },
      next() {
        if (!this.songReady) return
        if (this.playList.length === 1) {
          this.loop()
          return
        } else {
          let index = this.currentIndex + 1
          if (index === this.playList.length) index = 0
          this.setCurrentIndex(index)
          if (!this.playing) this.togglePlaying()
        }
        this.songReady = false
      },
      updateTime(e) {
        this.currentTime = e.target.currentTime
      },
      end() {
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      togglePlaying() {
        if (!this.songReady) return
        this.setPlayingState(!this.playing)
        if (this.currentLyric) this.currentLyric.togglePlay()
      },
      enter(el, done) {
        const {x, y, scale} = this._getPosAndScale()
        let animation = {
          0: {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0, 0, 0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0, 0, 0) scale(1)`
          }
        }
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all .4s'
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      progressBarChange(percent) {
        const current = this.currentSong.duration * percent
        this.$refs.audio.currentTime = current
        if (!this.playing) {
          this.togglePlaying()
        }
        if (this.currentLyric) {
          this.currentLyric.seek(current * 1000)
        }
      },
      getLyric() {
        this.currentSong.getLyric().then(lyric => {
          if (this.currentSong.lyric !== lyric) return
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(e => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
      },
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let line = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(line, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
      _getPosAndScale() {
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const paddingTop = 80
        const width = window.innerWidth * 0.8
        const scale = targetWidth / width
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
        return {x, y, scale}
      },
      ...mapActions([
        'savePlayHistory'
      ])
    },
    watch: {
      currentSong(val, old) {
        if (!val.id || val.id === old.id) return
        if (this.currentLyric) this.currentLyric.stop()
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(_ => {
          this.$refs.audio.play()
          this.getLyric()
        }, 500)
      },
      playing(val) {
        const audio = this.$refs.audio
        this.$nextTick(_ => val ? audio.play() : audio.pause())
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .m-player
    .normal-player
      fixed-cover()
      z-index: 150
      background: $c-bg
      .background
        absolute-cover()
        z-index: -1
        opacity: .6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position: absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $f-xl
            color: $c-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $f-l
          color: $c-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $f-m
          color: $c-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, .1)
              border-radius: 50%
              animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                absolute-cover()
                border-radius: 50%
          .player-lyric-wrapper
            width: 80%
            margin: 30px auto 0
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $f-m
              color: $c-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color:  $c-text-l
              font-size: $f-m
              &.current
                color: $c-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 4px
            background: $c-text-l
            &.active
              width: 20px
              background: $c-text-hl
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0 auto
          padding: 10px 0
          .time
            flex: 0 0 30px
            width: 30px
            line-height: 30px
            color: $c-text
            font-size: $f-s
          .time-l
            text-align: left
            margin-right: 6px
          .time-r
            text-align: right
            margin-left: 6px
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $c-theme
            i
              font-size: 30px
          .disable
            color: $c-text-d
          .i-left
            text-align: right
          .i-right
            text-align: left
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
      &.normal-enter-active, &.normal-leave-active
        transition: all .4s
        .top, .bottom
          transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100%, 0)
        .bottom
          transform: translate3d(0, 100%, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      width: 100%
      height: 60px
      z-index: 180
      background: $c-bg-h

      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $f-m
          color: $c-text
        .desc
          no-wrap()
          font-size: $f-s
          color: $c-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-playlist, .icon-play-mini, .icon-pause-mini
          font-size: 30px
          color: $c-theme-d
        .icon-mini
          position: absolute
          left: 0
          top: 0
          font-size: 32px
      &.mini-enter-active, &.mini-leave-active
        transition: all .4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
    @keyframes rotate
      0%
        transform: rotate(0)
      100%
        transform: rotate(360deg)
</style>
