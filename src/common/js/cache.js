import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

export function saveSearch(query) {
  // 从storage中拿到搜索历史, 默认为空数组
  let searches = storage.get(SEARCH_KEY, [])
  // 过滤掉相同的内容
  searches = searches.filter(search => search !== query)
  // 控制搜索历史的个数
  while (searches.length >= SEARCH_MAX_LENGTH) {
    searches.pop()
  }
  // 将最新搜索放到队列首位
  searches.unshift(query)
  // 存入storage
  storage.set(SEARCH_KEY, searches)
  // 返回结果
  return searches
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
