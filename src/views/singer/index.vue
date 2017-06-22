<template>
  <div class="singer" ref="singer">
      <singer-list :list="singers" @select-item="selectSinger" ref="singers"></singer-list>
      <router-view></router-view>
  </div>
</template>
<script>
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  import singerList from 'components/singer-list'
  import {mapMutations} from 'vuex'
  import * as types from 'store/mutation-types'
  import {playListMixin} from 'common/js/mixin'

  const HOT_TITLE = '热门'
  const HOT_SIZE = 10

  export default {
    data() {
      return {
        singers: []
      }
    },
    mixins: [playListMixin],
    created() {
      this._getSingerList()
    },
    components: {
      singerList
    },
    methods: {
      handlePlaylist(playList) {
        const bottom = playList.length ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.singers.refresh()
      },
      selectSinger(item) {
        this.$router.push({
          path: `/singer/${item.id}`
        })
        this.setSinger(item)
      },
      _getSingerList() {
        getSingerList().then(res => {
          if (res.code === ERR_OK) {
            this.singers = this._formatSingers(res.data.list)
          }
        })
      },
      _formatSingers(list) {
        const hot = {
          title: HOT_TITLE,
          items: []
        }
        const map = {}
        list.forEach((item, index) => {
          if (index < HOT_SIZE) {
            hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          let key = item.Findex
          if (!/[a-z]/i.test(key)) return
          if (!map[key]) {
            map[key] = {
              title: key,
              items: [new Singer({
                id: item.Fsinger_mid,
                name: item.Fsinger_name
              })]
            }
          } else {
            map[key].items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
        })
        let ret = Object.values(map).sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        ret.unshift(hot)
        return ret
      },
      ...mapMutations({
        setSinger: types.SET_SINGER
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
