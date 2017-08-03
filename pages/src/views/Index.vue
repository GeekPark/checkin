<template lang="jade">
#index
  el-row
    el-col(:span='12')
      .input-area
        input.input(type='text', @keyup.enter='enter', placeholder='请输入取票码', v-model='ticket_no')
        p.take-msg(v-bind:class="{takeSuccess: take_msg === '签到成功'}") {{take_msg}}
    el-col.info-row(:span='12')
      .info(v-if='info.ticket.ticket_no')
        .ticket
          p
            span 票种:
            span {{info.ticket_cat.name || 'null'}}
          p
            span 取票号码:
            span {{info.ticket.ticket_no || 'null'}}
          p
            span 签到时间:
            span {{info.ticket.checkin_time || 'null'}}
          p
            span 姓名:
            span {{info.personal.realname || 'null'}}
          p
            span 邮箱:
            span {{info.personal.email || 'null'}}
          p
            span 电话:
            span {{info.personal.mobile || 'null'}}
          p
            span 行业:
            span {{info.personal.industry || 'null'}}
          p
            span 职能:
            span {{info.personal.competency || 'null'}}
          p
            span 职位:
            span {{info.personal.position || 'null'}}
          p
            span 公司:
            span {{info.personal.company || 'null'}}
          p
            span 支付渠道 | 支付日期:
            span(v-if='info.payment') {{info.payment.pay_time || 'null'}} {{info.payment.pay_type || 'null'}}
            span(v-else) 无支付信息
          p
            span order id:
            span {{info.ticket.order_id || 'null'}}
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
        personal: {}
      }
    }
  },
  watch: {
    'ticket_no': function (val) {
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
          this.info = result.data.data
        } else {
          this.take_msg = '签到成功'
          this.info = result.data.data
        }
        this.ticket_no = ''
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
