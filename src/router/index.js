
import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

const rank = _ => import('../views/rank')
const recommend = _ => import('../views/recommend')
const search = _ => import('../views/search')
const singer = _ => import('../views/singer')
const singerDetail = _ => import('../views/singer-detail')
const disc = _ => import('../views/disc')
const topList = _ => import('../views/top-list')

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/rank',
      name: 'rank',
      component: rank,
      children: [{
        path: ':id',
        component: topList
      }]
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: recommend,
      children: [{
        path: ':id',
        name: 'disc',
        component: disc
      }]
    },
    {
      path: '/search',
      name: 'search',
      component: search,
      children: [{
        path: ':id',
        component: singerDetail
      }]
    },
    {
      path: '/singer',
      name: 'singer',
      component: singer,
      children: [{
        path: ':id',
        component: singerDetail
      }]
    }
  ]
})
