import axios from 'axios'
import {commonParams} from './config'

export function getLyric(mid) {
  const url = '/api/lyric'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: Date.now(),
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    g_tk: 67232076,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then(res => Promise.resolve(res.data))
}

