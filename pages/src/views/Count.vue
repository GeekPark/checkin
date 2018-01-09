<template lang="jade">
#count
  h2(v-for='(item, $index) in total', :key='$index') {{item[1]}} {{item[0]}}
</template>

<script>
import api from '../vuex/api'
export default {
  data () {
    return {
      total: []
    }
  },
  methods: {
  },
  mounted () {
    api.get('count').then(result => {
      this.total = result.data
    })
  }

}
</script>

<style scoped>
#count {
  text-align: left;
}
</style>
