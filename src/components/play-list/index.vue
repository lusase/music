<template>
  <transitonn name="list-fade">
    <div class="play-list">
      <div class="list-wrapper">
        <div class="header">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text"></span>
            <span class="clear"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <div class="content">
          <ul>
            <li class="item">
              <i class="current"></i>
              <span class="text"></span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="delete">
                <i class="icon-delete"></i>
              </span>
            </li>
          </ul>
        </div>
        <div class="operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="close">
          <span>关闭</span>
        </div>
      </div>
    </div>
  </transitonn>
</template>
<script>

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
      top: 0
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
        line-height: 50
        background: $c-bg
        font-size: $f-xs
        color: $c-text-l
</style>
