import Vue from 'vue'

let pad = val => {
  let str = '0' + val
  return str.substr(str.length - 2, str.length)
}
Vue.filter('songTime', function (value) {
  value = ~~+value
  const minute = pad(~~(value / 60))
  const second = pad(value % 60)
  return `${minute}:${second}`
})
