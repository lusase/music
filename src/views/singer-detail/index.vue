<template>
  <transition name="slide">
    <music-list :songs="songs" :title="singer.name" :bg-image="singer.avatar" :rank="true"></music-list>
  </transition>
</template>
<script>
  import musicList from 'components/music-list'
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      ...mapGetters(['singer'])
    },
    components: {
      musicList
    },
    created() {
      if (!this.singer.id) return this.$router.push('/singer')
      this._getDetail()
    },
    methods: {
      _getDetail() {
        getSingerDetail(this.singer.id).then(res => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach(item => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
  }
</script>
<style lang="stylus" scoped>
</style>
