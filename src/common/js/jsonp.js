import _jsonp from 'jsonp'

function param(data) {
  let url = ''
  Object.keys(data).forEach(item => {
    url += `&${item}=${encodeURIComponent(data[item] || '')}`
  })
  return url ? url.substr(1) : url
}
export default function jsonp(url, data, options) {
  url += (/\?/.test(url) ? '&' : '?') + param(data)
  return new Promise((resolve, reject) => {
    _jsonp(url, options, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}
