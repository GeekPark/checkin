export default [
  {
    path: '/',
    name: 'landing-page',
    component: require('./pages/Index.vue')
  },
  {
    path: '*',
    redirect: '/'
  }
]
