<template>
  <div class="m-slider" ref="slider">
    <div class="group" ref="sliderGroup">
      <slot>

      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="n in dots" :class="{active: picIndex === n - 1}"></span>
    </div>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  import { addClass } from 'common/js/dom'

  export default {
    data() {
      return {
        dots: 0,
        picIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    mounted() {
      requestAnimationFrame(_ => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()
        if (this.autoPlay) {
          this._play()
        }
      })
      window.addEventListener('resize', _ => {
        this._setSliderWidth(true)
        this.slider.refresh()
      })
    },
    methods: {
      _setSliderWidth(isResize = false) {
        this.children = this.$refs.sliderGroup.children
        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        Array.from(this.children).forEach(item => {
          addClass(item, 'item')
          item.style.width = sliderWidth + 'px'
          width += sliderWidth
        })
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initDots() {
        this.dots = this.children.length
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400,
          click: navigator.userAgent.indexOf('iPhone') === -1
        })
        this.slider.on('scrollEnd', _ => {
          let pageX = this.slider.getCurrentPage().pageX
          if (this.loop) {
            pageX--
          }
          this.picIndex = pageX
          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
      },
      _play() {
        this.timer = setTimeout(_ => {
          let index = this.picIndex + (this.loop ? 2 : 1)
          this.slider.goToPage(index, 0, 400)
        }, this.interval)
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .m-slider
    min-height: 1px
    .group
      position: relative
      overflow: hidden
      white-space: nowrap
      .item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      left: 0
      right: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 4px
        background-color: $c-text-l
        transition: width .2s
        &.active
          width: 20px
          background-color: $c-text-hl
</style>
