<template lang="jade">
#count
  el-tabs(v-model='activeName', @tab-click='handleClick')
    el-tab-pane(label='8 5  极客探索票', name='1') 8 5  极客探索票
    el-tab-pane(label='8 5  极客探索票', name='2') 8 6  极客探索票
    el-tab-pane(label='8 5  极客探索票', name='3') 极客超级票
    el-tab-pane(label='8 5  极客探索票', name='4') 极客信仰票
</template>

<script>
// import api from '../vuex/api'
export default {
  data () {
    return {
      activeName: '1'
    }
  },
  methods: {
    handleClick (tab, event) {
    }
  }
}
</script>

<style scoped>
#count {
  text-align: left;
}
</style>
