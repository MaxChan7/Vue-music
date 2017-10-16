import * as types from './mutation-types'
import {playMode} from '@/common/js/config'
import {shuffle} from '@/common/js/util'
import {saveSearch, delSearch, clearSearch} from '@/common/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list);
  if (state.mode === playMode.random) {
    let randomList = shuffle(list);
    commit(types.SET_PLAYLIST, randomList);
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list);
  }
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
}

export const randomPlay = function({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 新增歌曲到播放列表
export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice(0)
  let sequenceList = state.sequenceList.slice(0)
  let currentIndex = state.currentIndex

  // 记录当前歌曲
  let currentSong = playlist[currentIndex]

  // 查询待添加的歌曲是否已在播放列表中
  let fpIndex = findIndex(playlist, song)

  // 插入到当前索引
  currentIndex++
  playlist.splice(currentIndex, 0, song)

  // 如果待添加的歌曲已在播放列表中，删除原有歌曲
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  // 插入到 sequenceList 中的位置
  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  // 查询待添加的歌曲是否已在 sequenceList 列表中
  let fsIndex = findIndex(sequenceList, song)

  // 插入到当前索引
  sequenceList.splice(currentSIndex, 0, song)

  // 如果待添加的歌曲已在播放列表中，删除原有歌曲
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
}

export const saveHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const delHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, delSearch(query))
}

export const clearHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playlist.length > 0;
  commit(types.SET_PLAYING_STATE, playingState)
}

export const deleteSongList = function ({commit}) {
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYING_STATE, false)
}
