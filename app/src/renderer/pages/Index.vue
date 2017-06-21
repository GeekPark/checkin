<template lang="jade">
#index()
  h1 GEEKPARK 签到
  div
    input.input(type='text', @keyup.enter='enter', placeholder='请输入取票码', v-model='ticket_no')
  br
  h1 票务信息
  .info
    .ticket
      p
        span number:
        | {{info.ticket.ticket_no || 'null'}}
      p
        span id:
        | {{info.ticket.id || 'null'}}
      p
        span order id:
        | {{info.ticket.order_id || 'null'}}
      p
        span name:
        | {{info.ticket_cat.name || 'null'}}
      p
        span price:
        | {{info.ticket_cat.price || 'null'}}
      p
        span extra:
        | {{info.ticket_cat.extra || 'null'}}
      p
        span userid:
        | {{info.user.id || 'null'}}
      p
        span username:
        | {{info.user.username || 'null'}}
      p
        span realname:
        | {{info.user.realname || 'null'}}
      p
        span email:
        | {{info.user.email || 'null'}}
  br
  //- h1 操作
  //- .confim(@click='space') 确认
  p 提示: 输入票号后, 回车(enter)取票
</template>

<script>
import api from '../vuex/api'
export default {
  data () {
    return {
      ticket_no: '',
      info: {
        ticket:{},
        ticket_cat:{},
        user:{}
      }
    }
  },
  methods: {
    enter () {
      console.log('enter')
      if (this.ticket_no === '') {return alert('请输入取票码');}
      api.get(`check/${this.ticket_no}`).then(result => {
        console.log(result.data)
        if (result.data.msg) {
          return alert(result.data.msg)
        }
        this.info = result.data.data
      }).catch(err => {
        console.log(err)
        alert('没找到相关票!')
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
    text-align: left;
    padding: 5%;
  }
  .input {
    width: 200px;
    height: 40px;
    font-size: 30px;
    outline: none;
    padding: 5px;
  }
  .info {
    text-align: left;
  }
  .info p span {
    width: 100px;
    display: inline-block;
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
