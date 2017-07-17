import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, deleteSearch, clearSearches} from 'common/js/cache'

function findIndex(list, song) {
  return list.findIndex(item => item.id === song.id)
}

export const selectPlay = ({commit, state}, {list, index}) => {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAY_LIST, randomList)
    commit(types.SET_CURRENT_INDEX, findIndex(randomList, list[index]))
  } else {
    commit(types.SET_PLAY_LIST, list)
    commit(types.SET_CURRENT_INDEX, index)
  }
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
export const randomPlay = ({commit}, list) => {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAY_LIST, shuffle(list))
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
export const insertSong = ({commit, state}, song) => {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  if (!playList.length) {
    playList.push(song)
    sequenceList.push(song)
    currentIndex = 0
  } else {
    let currentSong = playList[currentIndex]
    let sCurrentIndex = findIndex(sequenceList, currentSong)
    currentIndex = _insertSong(playList, song, currentSong, currentIndex)
    _insertSong(sequenceList, song, currentSong, sCurrentIndex)
  }

  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

function _insertSong(list, song, currentSong, currentIndex) {
  let index = findIndex(list, song)
  // 判断list中是否有这首歌
  if (index > -1) {
    // 将这首歌弹出数组
    list.splice(index, 1)
    // 获取当前播放歌曲的下标
    let _index = findIndex(list, currentSong)
    // 如果当前歌曲没有被弹出 将当前歌曲下标下移一位 否则 保持原位置
    currentIndex = _index > -1 ? _index + 1 : currentIndex
  } else {
    currentIndex++
  }
  list.splice(currentIndex, 0, song)
  return currentIndex
}

export const saveSearchHistory = ({commit}, query) => {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = ({commit}, query) => {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = ({commit}) => {
  commit(types.SET_SEARCH_HISTORY, clearSearches())
}
