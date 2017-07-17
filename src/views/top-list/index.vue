<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songlist" :rank="true"></music-list>
  </transition>
</template>
<script>
  import musicList from 'components/music-list'
  import {mapGetters} from 'vuex'
  import {getCurrentTopList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  export default {
    data() {
      return {
        songlist: []
      }
    },
    created() {
      if (!this.topList.id) {
        return this.$router.push({
          path: '/rank'
        })
      }
      this._getCurrentTopList()
    },
    computed: {
      title() {
        return this.topList.topTitle
      },
      bgImage() {
        return this.songlist.length ? this.songlist[0].image : ''
      },
      ...mapGetters([
        'topList'
      ])
    },
    methods: {
      _getCurrentTopList() {
        getCurrentTopList(this.topList.id).then(res => {
          if (res.code === ERR_OK) {
            this.songlist = this._parseList(res.songlist)
          }
        })
      },
      _parseList(songlist) {
        const ret = []
        songlist.forEach(item => {
          if (item.data.songid && item.data.albumid) {
            ret.push(createSong(item.data))
          }
        })
        return ret
      }
    },
    components: {
      musicList
    }
  }
</script>
<style lang="stylus" scoped>

</style>
