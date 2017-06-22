<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import {prefixStyle} from 'common/js/dom'
  const transform = prefixStyle('transform')
  const btnWidth = 16
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    computed: {
      barWidth() {
        return this.$refs.progressBar.clientWidth - btnWidth
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      progressClick(e) {
        const offsetWidth = e.pageX - this.$refs.progressBar.getBoundingClientRect().left
        this._offset(offsetWidth)
        this._triggerPercent()
      },
      progressTouchStart(e) {
        this.touch.start = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove(e) {
        if (!this.touch.start) return
        const delta = e.touches[0].pageX - this.touch.startX
        const offsetWidth = Math.min(this.barWidth, Math.max(0, this.touch.left + delta))
        this._offset(offsetWidth)
      },
      progressTouchEnd() {
        this.touch.start = false
        this._triggerPercent()
      },
      _triggerPercent() {
        const percent = this.$refs.progress.clientWidth / this.barWidth
        this.$emit('percentChange', percent)
      },
      _offset(offsetWidth) {
        this.$refs.progress.style.width = offsetWidth + 'px'
        this.$refs.progressBtn.style[transform] = `translateX(${offsetWidth}px)`
      }
    },
    watch: {
      percent(val) {
        if (val >= 0 && !this.touch.start) {
          const offsetWidth = val * this.barWidth
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, .3)
      .progress
        position: absolute
        height: 100%
        background: $c-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $c-text
          border-radius: 50%
          background: $c-theme
</style>
