<template lang="jade">
#index
  el-row
    el-col(:span='12')
      .input-area
        input.input(type='text', @keyup.enter='enter', placeholder='请输入手机号', v-model='phone')
        p.take-msg(v-bind:class="{takeSuccess: info.success}") {{info.msg}}
</template>

<script>
import api from '../vuex/api'
export default {
  data () {
    return {
      phone: '',
      info: {
        msg: '',
        success: false
      }
    }
  },
  watch: {
  },
  methods: {
    enter () {
      console.log('enter')
      if (this.phone === '') { return alert('请输入手机号') }
      api.get(`gift/${this.phone}`).then(result => {
        console.log(result.data)
        this.info = result.data
      }).catch(err => {
        console.log(err)
        alert('没找到相关信息!')
      })
    }
  },
  mounted () {
    // this.enter()
    // document.onkeydown =  () => {
    //   this.space()
    // }
  }
}
</script>

<style scoped>

  #index {

  }
  .input {
    font-size: 30px;
    outline: none;
    padding: 5px;
    text-align: center;
  }
  .take-msg {
    color: #FD747C;
    font-size: 20px;
  }
  .takeSuccess {
    color: #397D28;
  }
  .info-row {
    text-align: left;
  }
  .info {
    width: 100%;
    display: inline-block;
    border: 1px solid #DEDEDE;
  }
  .info p span {
    width: 150px;
    display: inline-block;
    text-align: left;
    margin-right: 10px;
    padding: 0px 20px;
  }
  .confim {
    display:inline-block;
    color:#444;
    border:1px solid #CCC;
    background:#DDD;
    box-shadow: 0 0 5px -1px rgba(0,0,0,0.2);
    cursor:pointer;
    vertical-align:middle;
    max-width: 100px;
    padding: 10px 50px;
    text-align: center;
  }
  .confim:active {
      color:red;
      box-shadow: 0 0 5px -1px rgba(0,0,0,0.6);
  }
</style>
