import jsonp from 'common/js/jsonp'
import {commonParams, params} from './config'

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1
  })
  return jsonp(url, data, params)
}

export function getCurrentTopList(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1,
    page: 'detail',
    type: 'top',
    tpl: 3,
    topid
  })
  return jsonp(url, data, params)
}
