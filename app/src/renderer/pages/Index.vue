<template lang="jade">
#index()
  //- current-page
  p 签到
  input.input(type='text', @keyup.enter='enter', placeholder='请输入取票码')
</template>

<script>
import api from '../vuex/api'
export default {
  data () {
    return {
    }
  },
  methods: {
    enter () {
      console.log('enter')
    }
  }
}
</script>

<style scoped>
  img {
    margin-top: -25px;
    width: 450px;
  }
  .input {
    width: 200px;
    height: 40px;
    font-size: 30px;
    outline: none;
    padding: 5px;
  }
</style>
