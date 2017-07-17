<template>
  <transition name="slide">
    <music-list :title="title" :songs="songs" :bg-image="bgImage"></music-list>
  </transition>
</template>
<script>
  import musicList from 'components/music-list'
  import {mapGetters} from 'vuex'
  import {getDiscSongList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    created() {
      this._getSongList()
    },
    methods: {
      _getSongList() {
        if (!this.disc.dissid) {
          return this.$router.push({
            path: '/recommend'
          })
        }
        getDiscSongList(this.$route.params.id).then(res => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.cdlist[0].songlist)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach(song => {
          if (song.songid && song.albumid) {
            ret.push(createSong(song))
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
