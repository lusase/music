import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

function insertArray(arr, item, key, maxLength, filter = e => e !== item) {
  // 过滤掉相同的内容
  arr = arr.filter(filter)
  // 控制数组的个数
  while (arr.length >= maxLength) {
    arr.pop()
  }
  // 将item放到队列首位
  arr.unshift(item)
  // 存入storage
  storage.set(key, arr)
  // 返回结果
  return arr
}

export function saveSearch(query) {
  // 从storage中拿到搜索历史, 默认为空数组
  let searches = storage.get(SEARCH_KEY, [])
  return insertArray(searches, query, SEARCH_KEY, SEARCH_MAX_LENGTH)
}

export function loadSearches() {
  return storage.get(SEARCH_KEY, [])
}

export function deleteSearch(query) {
  let searches = loadSearches()
  searches.splice(searches.indexOf(query), 1)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearches() {
  storage.remove(SEARCH_KEY)
  return []
}

export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  return insertArray(songs, song, PLAY_KEY, PLAY_MAX_LENGTH, e => e.id !== song.id)
}

export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

export function clearPlay() {
  storage.remove(PLAY_KEY)
  return []
}

export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  return insertArray(songs, song, FAVORITE_KEY, FAVORITE_MAX_LENGTH, e => e.id !== song.id)
}

export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  let index = songs.findIndex(e => e.id === song.id)
  if (index > -1) songs.splice(songs.findIndex(e => e.id === song.id), 1)
  storage.set(FAVORITE_KEY, songs)
  return songs
}
export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}


