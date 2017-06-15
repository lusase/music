import 'babel-polyfill'
import 'common/stylus/index.styl'

import Vue from 'vue'
import LazyLoad from 'vue-lazyload'

import fastclick from 'fastclick'


import App from './App'
import router from './router'
import store from './store'




fastclick.attach(document.body)
Vue.config.productionTip = false
Vue.use(LazyLoad, {
  loading: require('./common/image/default.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
