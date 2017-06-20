<template lang="jade">
#index(v-loading.body="loading")
  current-page
  p 签到
</template>

<script>
import api from '../vuex/api'
export default {
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>
  img {
    margin-top: -25px;
    width: 450px;
  }
</style>
