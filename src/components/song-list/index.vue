<template>
  <div class="song-list">
    <ul>
      <li class="item" v-for="(song, index) in songs" @click="selectItem(song, index)">
        <div v-if="rank" class="rank">
          <span :class="getRankCls(index)">{{getRankText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>

  export default {
    props: {
      songs: {
        type: Array,
        default: () => []
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      getDesc(song) {
        return `${song.singer} · ${song.album}`
      },
      selectItem(song, index) {
        this.$emit('select', song, index)
      },
      getRankCls(index) {
        if (index < 3) {
          return `icon icon${index}`
        }
        return 'text'
      },
      getRankText(index) {
        if (index < 3) {
          return ''
        }
        return index + 1
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $f-m
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $c-theme
          font-size: $f-l
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $c-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $c-text-d
</style>
