<template>
  <div class="m-header">
    <div class="icon"></div>
    <div class="text">DingDang Music</div>
    <router-link
      to="/mine"
      class="mine"
      tag="div"
    >
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>
<script>
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .m-header
    position: relative
    height: 44px
    text-align: center
    color: $c-theme
    font-size: 0
    .icon
      display: inline-block
      vertical-align: top
      margin-top: 6px
      width: 30px
      height: 32px
      margin-right: 9px
      bg-image('logo')
      background-size: 30px 32px
      border-radius: 50%
    .text
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size: $f-l
    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: $c-theme

</style>
