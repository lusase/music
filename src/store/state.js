import {playMode} from 'common/js/config'
import {loadSearches, loadPlay, loadFavorite} from 'common/js/cache'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: {},
  searchHistory: loadSearches(),
  playHistory: loadPlay(),
  favoriteList: loadFavorite()
}

export default state
