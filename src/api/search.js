import jsonp from 'common/js/jsonp'
import {commonParams, params} from './config'

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1
  })

  return jsonp(url, data, params)
}

export function search(query, page, zhida, perpage = 20) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1,
    w: query,
    p: page,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 0,
    aggr: 0,
    perpage,
    n: perpage,
    remoteplace: 'txt.mqq.all',
    uid: 0
  })

  return jsonp(url, data, params)
}
