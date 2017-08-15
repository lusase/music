<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"/>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <m-scroll :refreshDelay="100" class="shortcut" ref="shortcut" :list="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" @click="addQuery(item.k)" v-for="item in hotKey">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list
            :searches="searchHistory"
            @select="addQuery"
            @delete="deleteSearchHistory"
          ></search-list>
        </div>
        </div>
      </m-scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <m-suggest :query="query" @beforeScroll="suggestScroll" @select="suggestSelect"></m-suggest>
    </div>
    <m-confirm title="要清空所有搜索历史吗?" confirmText="清空" ref="mConfirm" @confirm="clearSearchHistory"></m-confirm>
    <router-view></router-view>
  </div>
</template>
<script>
  import mConfirm from 'components/m-confirm'
  import mScroll from 'components/m-scroll'
  import searchList from 'components/search-list'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {mapActions} from 'vuex'
  import {playListMixin, searchMixin} from 'common/js/mixin'

  export default {
    data() {
      return {
        hotKey: []
      }
    },
    mixins: [playListMixin, searchMixin],
    components: {
      searchList,
      mConfirm,
      mScroll
    },
    computed: {
      shortcut() {
        return this.hotKey.concat(this.searchHistory)
      }
    },
    created() {
      this._getHotKey()
    },
    watch: {
      query(val) {
        if (!val) {
          requestAnimationFrame(() => {
            this.$refs.shortcut.refresh()
          })
        }
      }
    },
    methods: {
      _getHotKey() {
        getHotKey().then(res => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      handlePlaylist(playList) {
        const bottom = playList.length ? '60px' : ''
        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.searchResult.style.bottom = bottom
      },
      showConfirm() {
        this.$refs.mConfirm.show()
      },
      ...mapActions([
        'clearSearchHistory'
      ])
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $f-m
            color: $c-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $c-bg-h
            font-size: $f-m
            color: $c-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $f-m
            color: $c-text-l
            .text
              flex: 1
            .clear
              .icon-clear
                font-size: $f-m
                color: $c-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0

</style>
