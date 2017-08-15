import {mapGetters, mapMutations, mapActions} from 'vuex'
import * as types from 'store/mutation-types'

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

import {playMode} from './config'
import {shuffle} from './util'

export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence'
        : this.mode === playMode.random ? 'icon-random' : 'icon-loop'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'mode',
      'playList',
      'favoriteList'
    ])
  },

  methods: {
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.setCurrentIndex(list.indexOf(this.currentSong))
      this.setPlayList(list)
    },
    getFavoriteIcon(song) {
      return this.isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
    },
    toggleFavorite(song) {
      this.isFavorite(song) ? this.deleteFavoriteSong(song) : this.saveFavoriteSong(song)
    },
    isFavorite(song) {
      return this.favoriteList.findIndex(e => e.id === song.id) > -1
    },
    ...mapMutations({
      setFullScreen: types.SET_FULL_SCREEN,
      setPlayingState: types.SET_PLAYING_STATE,
      setCurrentIndex: types.SET_CURRENT_INDEX,
      setPlayMode: types.SET_PLAY_MODE,
      setPlayList: types.SET_PLAY_LIST
    }),
    ...mapActions([
      'saveFavoriteSong',
      'deleteFavoriteSong'
    ])
  }
}

import searchBox from 'components/search-box'
import mSuggest from 'components/m-suggest'

export const searchMixin = {
  data() {
    return {
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    suggestScroll() {
      this.$refs.searchBox.blur()
    },
    onQueryChange(query) {
      this.query = query
    },
    suggestSelect() {
      this.$refs.searchBox.blur()
      this.saveSearchHistory(this.query)
    },
    addQuery(key) {
      this.$refs.searchBox.setQuery(key)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  },
  components: {
    searchBox,
    mSuggest
  }
}

