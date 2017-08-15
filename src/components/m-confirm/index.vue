<template>
  <transition name="confirm-fade">
    <div class="m-confirm" v-show="showFlag" @click.stop>
      <div class="wrapper">
        <div class="content">
          <p class="text">{{title}}</p>
          <div class="operate">
            <div class="btn left" @click="cancel">{{cancelText}}</div>
            <div class="btn" @click="confirm">{{confirmText}}</div>
          </div>
        </div>
      </div>
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
      title: {
        type: String,
        default: '确定吗?'
      },
      confirmText: {
        type: String,
        default: '确定'
      },
      cancelText: {
        type: String,
        default: '取消'
      }
    },
    methods: {
      show() {
        this.showFlag = true
      },
      hide() {
        this.showFlag = false
      },
      cancel() {
        this.hide()
        this.$emit('cancel')
      },
      confirm() {
        this.hide()
        this.$emit('confirm')
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .m-confirm
    fixed-cover()
    z-index: 998
    background-color: $c-bg-d
    &.confirm-fade-enter-active
      animation: confirm-fadein .3s
      .content
        animation: confirm-zoom .3s
    .wrapper
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      z-index: 999
      .content
        width: 270px
        border-radius: 13px
        background: $c-bg-h
        .text
          padding: 19px 15px
          line-height: 22px
          text-align: center
          font-size: $f-l
          color: $c-text-l
        .operate
          display: flex
          align-items: center
          text-align: center
          font-size: $f-l
          .btn
            flex: 1
            line-height: 22px
            padding: 10px 0
            border-top: 1px solid $c-bg-d
            color: $c-text-d
            &.left
              border-right: 1px solid $c-bg-d

  @keyframes confirm-fadein
    0%
      opacity: 0
    100%
      opacity: 1
  @keyframes confirm-zoom
    0%
      transform: scale(0)
    50%
      transform: scale(1.1)
    100%
      transform: scale(1)
</style>
