<template>
  <m-scroll
    :list="result"
    class="suggest"
    @scrollToEnd="searchMore"
    :pullup="true"
    ref="suggest"
    :beforeScroll="true"
    @beforeScroll="blurSearchBox"
  >
    <ul class="suggest-list">
      <li v-for="item in result" class="suggest-item" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getName(item)"></p>
        </div>
      </li>
      <m-loading v-show="hasMore" title=""></m-loading>
    </ul>
    <div class="no-result-wrapper" v-show="query && !result.length">
      <no-result>
        抱歉 , 暂无结果
      </no-result>
    </div>
  </m-scroll>
</template>
<script>
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import mScroll from 'components/m-scroll'
  import mLoading from 'components/m-loading'
  import noResult from 'components/no-result'
  import Singer from 'common/js/singer'
  import {mapMutations, mapActions} from 'vuex'

  const TYPE_SINGER = 'singer'
  const PER_PAGE = 20

  export default {
    data() {
      return {
        page: 1,
        result: [],
        hasMore: true,
        search_pending: false
      }
    },
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      query(val) {
        if (!val) return
        this.hasMore = true
        this.page = 1
        this.search()
      }
    },
    methods: {
      search() {
        this.search_pending = true
        this.$refs.suggest.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, PER_PAGE).then(res => {
          if (res.code === ERR_OK) {
            this.result = this.handleResult(res.data)
            this.hasMore = this._checkMore(res.data)
          }
          this.search_pending = false
        })
      },
      handleResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._handleSongList(data.song.list))
        }
        return ret
      },
      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name} - ${item.singer}`
        }
      },
      searchMore() {
        if (!this.hasMore || this.search_pending) {
          return
        }
        this.page++
        this.search_pending = true
        search(this.query, this.page, this.showSinger, PER_PAGE).then(res => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this.handleResult(res.data))
            this.hasMore = this._checkMore(res.data)
          }
          this.search_pending = false
        })
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
        this.$emit('select')
      },
      blurSearchBox() {
        this.$emit('beforeScroll')
      },
      _handleSongList(list) {
        let ret = []
        list.forEach(item => {
          if (item.songid && item.albumid) {
            ret.push(createSong(item))
          }
        })
        return ret
      },
      _checkMore(data) {
        const song = data.song
        return !!song.list.length && (song.curnum + song.curpage * PER_PAGE < song.totalnum)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions(['insertSong'])
    },
    components: {
      mScroll,
      mLoading,
      noResult
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
        .icon
          flex: 0 0 30px
          width: 30px
          [class^=icon-]
            font-size: 14px
            color: $c-text-d
        .name
          flex: 1
          font-size: $f-m
          color: $c-text-d
          overflow: hidden
          .text
            no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
