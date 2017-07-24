<template lang="jade">
header
  el-tabs(v-model='activeName', @tab-click='handleClick')
    el-tab-pane(label='签到', name='/') 签到
    el-tab-pane(label='查询', name='/query') 查询
    el-tab-pane(label='统计', name='count') 统计
</template>

<script>
export default {
  data () {
    return {
      activeName: '/'
    }
  },
  methods: {
    handleClick (tab, event) {
      this.$router.push(tab.name)
    }
  }
}
</script>

<style scoped>
</style>
