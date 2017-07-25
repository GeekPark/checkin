<template lang="jade">
#count
  h2 85极客探索票   {{counts.t_85_checkin}} / {{counts.t_85}}
  h2 86极客探索票  {{counts.t_86_checkin}} / {{counts.t_86}}
  h2 极客超级票 &nbsp &nbsp {{counts.t_super_checkin}} / {{counts.t_super}}
  h2 极客信仰票 &nbsp &nbsp {{counts.t_faith_checkin}} / {{counts.t_faith}}
</template>

<script>
import api from '../vuex/api'
export default {
  data () {
    return {
      counts: {}
    }
  },
  methods: {
  },
  mounted () {
    api.get('count').then(result => {
      this.counts = result.data
    })
  }

}
</script>

<style scoped>
#count {
  text-align: left;
}
</style>
