<template>
  <transition name="drop">
    <div class="top-tip" v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>
<script>
  export default {
    data() {
      return {
        showFlag: false
      }
    },
    props: {
      delay: {
        type: Number,
        'default': 2000
      }
    },
    methods: {
      show() {
        this.showFlag = true
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.hide()
        }, this.delay)
      },
      hide() {
        this.showFlag = false
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .top-tip
    position: fixed
    top: 0
    width: 100%
    z-index: 500
    background: $c-bg-dialog
    &.drop-enter-active, &.drop-leave-active
      transition: all .3s
    &.drop-enter, &.drop-leave-to
      transform: translate3d(0, -100%, 0)
</style>
