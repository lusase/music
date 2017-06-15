<template>
  <m-scroll class="list-view" :list="list" ref="mScroll" :listenScroll="true" :probeType="3" @pos-scroll="posScroll">
    <ul>
      <li class="group" v-for="group in list" ref="groups">
        <h2 class="title">{{group.title}}</h2>
        <ul>
          <li class="item" v-for="item in group.items" @click="selectItem(item)">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name" v-html="item.name"></span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="shortcut" @touchstart="scrollContent" @touchmove.stop.prevent="moveContent">
      <ul>
        <li class="item" :class="{current: index === currentIndex}" v-for="(item, index) in shortcutList" :data-index="index">{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="scrollY < 0" :style="{transform:`translate3d(0,${fixedTop}px,0)`}">
      <div class="title">{{fixedTitle}}</div>
    </div>
    <div class="loading-container" v-show="!list.length" >
      <m-loading></m-loading>
    </div>
  </m-scroll>
</template>
<script>
  import mScroll from 'components/m-scroll'
  import mLoading from 'components/m-loading'
  import { dataAttr, hasClass } from 'common/js/dom'
  const touch = {}
  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30
  export default {
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        listHeight: [],
        diff: 0,
        fixedTop: 0
      }
    },
    props: {
      list: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      shortcutList() {
        return this.list.map(item => item.title.substr(0, 1))
      },
      fixedTitle() {
        return this.list.length ? this.list[this.currentIndex].title : ''
      }
    },
    components: {
      mScroll,
      mLoading
    },
    methods: {
      selectItem(item) {
        this.$emit('select-item', item)
      },
      scrollContent(e) {
        if (!hasClass(e.target, 'item')) return
        let index = +dataAttr(e.target, 'index')
        let firstTouch = e.touches[0]
        touch.y1 = firstTouch.pageY
        touch.anchorIndex = index
        this._scrollTo(index)
      },
      moveContent(e) {
        if (!hasClass(e.target, 'item')) return
        let firstTouch = e.touches[0]
        touch.y2 = firstTouch.pageY
        let delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
        this._scrollTo(touch.anchorIndex + delta)
      },
      posScroll(pos) {
        this.scrollY = pos.y
      },
      _scrollTo(index) {
        let el = this.$refs.groups[index]
        if (!el) return
        this.currentIndex = index
        this.$refs.mScroll.scrollToElement(el, 0)
      },
      _calculateHeight() {
        this.listHeight = [0]
        let height = 0
        this.$refs.groups.forEach(item => {
          this.listHeight.push(height += item.clientHeight)
        })
      }
    },
    watch: {
      list() {
        requestAnimationFrame(_ => {
          this._calculateHeight()
        })
      },
      scrollY(newY) {
        const listHeight = this.listHeight
        let index = 0
        while (listHeight[++index] && -newY > listHeight[index]);
        this.diff = listHeight[index] + newY
        this.currentIndex = index - 1
      },
      diff (val) {
        let fixedTop = (val > 0 && val < TITLE_HEIGHT) ? val - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) return
        this.fixedTop = fixedTop
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .list-view
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $c-bg
    .group
      padding-bottom: 30px
      .title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $f-s
        color: $c-text-l
        background: $c-bg-h
      .item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $c-text-l
          font-size:$f-m
    .shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $c-bg-d
      font-family:Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $c-text-l
        font-size: $f-s
        &.current
          color: $c-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $f-s
        color: $c-text-l
        background: $c-bg-h
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)

</style>
