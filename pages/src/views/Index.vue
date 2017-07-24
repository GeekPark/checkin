<template lang="jade">
#index()
  h1 GEEKPARK 签到
  div
    input.input(type='text', @keyup.enter='enter', placeholder='请输入取票码', v-model='ticket_no')
    p.take-msg(v-bind:class="{takeSuccess: take_msg === '签到成功'}") {{take_msg}}
  br
  h1 票务信息
  .info(v-if='info.ticket.ticket_no')
    .ticket
      p
        span 票种:
        span {{info.ticket_cat.name || 'null'}}
      p
        span 取票号码:
        span {{info.ticket.ticket_no || 'null'}}
      p
        span 姓名:
        span {{info.user.username || 'null'}}
      p
        span 邮箱:
        span {{info.user.email || 'null'}}
      p
        span 电话:
        span {{info.user.email || 'null'}}
      p
        span 行业:
        span {{info.user.email || 'null'}}
      p
        span 之能:
        span {{info.user.email || 'null'}}
      p
        span 职位:
        span {{info.user.email || 'null'}}
      p
        span 公司:
        span {{info.user.email || 'null'}}
      p
        span 支付渠道 | 支付日期:
        span {{info.user.email || 'null'}}
      p
        span order id:
        span {{info.ticket.order_id || 'null'}}

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
      take_msg: '',
      info: {
        ticket: {},
        ticket_cat: {},
        user: {}
      }
    }
  },
  methods: {
    enter () {
      console.log('enter')
      if (this.ticket_no === '') { return alert('请输入取票码') }
      api.get(`check/${this.ticket_no}`).then(result => {
        console.log(result.data)
        if (result.data.msg === '-1') {
          this.take_msg = '未找到相应门票'
        } else if (result.data.msg === '1') {
          this.take_msg = '该门票已签到'
        } else {
          this.take_msg = '签到成功'
          this.info = result.data.data
        }
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
  }
  .input {
    width: 200px;
    height: 40px;
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
  .info {
  }
  .info p span {
    width: 150px;
    display: inline-block;
    text-align: left;
    margin-right: 10px;
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
