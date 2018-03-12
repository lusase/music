import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    } else {
      return new Promise((resolve, reject) => {
        getLyric(this.mid).then(res => {
          if (res.code === ERR_OK) {
            this.lyric = Base64.decode(res.lyric)
            resolve(this.lyric)
          } else {
            reject('no lyric')
          }
        })
      })
    }
  }
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(s => {
    ret.push(s.name)
  })
  return ret.join('/')
}

export function createSong(data) {
  return new Song({
    id: data.songid,
    mid: data.songmid,
    singer: filterSinger(data.singer),
    name: data.songname,
    album: data.albumname,
    duration: data.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${data.albummid}.jpg?max_age=2592000`,
    // url: `http://ws.stream.qqmusic.qq.com/${data.songid}.m4a?fromtag=46`,
    url: `http://isure.stream.qqmusic.qq.com/C100${data.songmid}.m4a?fromtag=32`
  })
}
