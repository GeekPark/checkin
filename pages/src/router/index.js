import Vue from 'vue'
import Router from 'vue-router'
import Index from '../views/Index.vue'
import Count from '../views/Count.vue'
import Query from '../views/Query.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta: { title: '签到' }
    },
    {
      path: '/query',
      name: 'Query',
      component: Query,
      meta: { title: '查询' }
    },
    {
      path: '/count',
      name: 'Count',
      component: Count,
      meta: { title: '统计' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
