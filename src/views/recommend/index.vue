<template>
  <div class="recommend" ref="recommend">
    <m-scroll ref="scrollContent" class="content" :list="discList">
      <div>
        <div class="slider-wrapper" v-if="recommends.length">
          <m-slider>
            <div v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img @load="imageLoad" :src="item.picUrl">
              </a>
            </div>
          </m-slider>
        </div>
        <div class="list">
          <h1 class="title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" class="item" v-for="item in discList" :key="item.dissid">
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <m-loading></m-loading>
      </div>
    </m-scroll>
    <router-view></router-view>
  </div>
</template>
<script>
  import mSlider from 'components/m-slider'
  import mScroll from 'components/m-scroll'
  import mLoading from 'components/m-loading'
  import BScroll from 'better-scroll'
  import {getRecommend, getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {playListMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'
  import * as mutationTypes from 'store/mutation-types'

  export default {
    data() {
      return {
        recommends: [],
        discList: []
      }
    },
    mixins: [playListMixin],
    created() {
      this._getRecommend()
      this._getDiscList()
    },
    methods: {
      handlePlaylist(playList) {
        const bottom = playList.length ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom
      },
      _getRecommend() {
        getRecommend().then(res => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      },
      _getDiscList() {
        getDiscList().then(res => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      imageLoad() {
        if (this.imageLoaded) return
        this.imageLoaded = true
        this.$refs.scrollContent.refresh()
      },
      selectItem(item) {
        this.$router.push({
          path: `recommend/${item.dissid}`
        })
        this.setDisc(item)
      },
      ...mapMutations({
        setDisc: mutationTypes.SET_DISC
      })
    },
    components: {
      mSlider,
      mScroll,
      mLoading
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .list
        .title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $f-m
          color: $c-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $f-m
            .name
              margin-bottom: 10px
              color: $c-text
            .desc
              color: $c-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
