import Vue from 'vue'
import Electron from 'vue-electron'
import Resource from 'vue-resource'
import Router from 'vue-router'

import App from './App'
import routes from './routes'
import ElementUI from 'element-ui'
import Vheader from './components/Vheader.vue'
import CurrentPage from './components/CurrentPage.vue'

Vue.use(ElementUI)
Vue.use(Electron)
Vue.use(Resource)
Vue.use(Router)
Vue.component(CurrentPage.name, CurrentPage)
Vue.component(Vheader.name, Vheader)
Vue.config.debug = true

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes
})

/* eslint-disable no-new */
const app = new Vue({
  router,
  ...App
}).$mount('#app')

export default app
