import {mapGetters} from 'vuex'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playList)
  },
  activated() {
    this.handlePlaylist(this.playList)
  },
  watch: {
    playList(val) {
      this.handlePlaylist(val)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlayList method')
    }
  }
}
