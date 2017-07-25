<template lang="jade">
#query
  el-select(v-model='key', placeholder='请选择')
    el-option(v-for='item in options', :label='item.label', :value='item.value')
  input.input(v-model='value', placeholder='回车搜索', @keyup.enter='enter')
  p &nbsp
  el-table(:data='tickets', style="width: 100%", border)
    el-table-column(prop='ticket_cat.name', label='票种', width='100')
    el-table-column(prop='ticket.ticket_no', label='取票号码', width='130',  fixed="left")
    el-table-column(prop='ticket.state', label='状态', width='100')
    el-table-column(prop='user.realname', label='姓名', width='100')
    el-table-column(prop='user.email', label='邮箱', width='130')
    el-table-column(prop='user.mobile', label='电话', width='130')
    el-table-column(prop='user.competency', label='职能', width='70')
    el-table-column(prop='user.position', label='职位', width='130')
    el-table-column(prop='user.company', label='公司', width='130')
    el-table-column(prop='payment.pay_time', label='订单时间', width='130')
    el-table-column(prop='payment.pay_type', label='方式', width='130')
    el-table-column(prop='ticket.order_id', label='订单号', width='130')
    el-table-column(label='操作', width='190',  fixed="right")
      template(scope='scope')
        el-button(size='small',
                  type='info',
                  @click.stop='checkin(scope.row)') 签到
        el-button(size='small',
                  type='danger',
                  @click.stop='cancel(scope.row)') 取消
</template>

<script>
import api from '../vuex/api'
export default {
  data () {
    return {
      tickets: [],
      key: 'mobile',
      value: '150',
      options: [{
        value: 'mobile',
        label: '手机号'
      }, {
        value: 'realname',
        label: '姓名'
      }, {
        value: 'email',
        label: '邮箱'
      }, {
        value: 'ticket_no',
        label: '取票号码'
      }]
    }
  },
  watch: {
    'tickets': function (val) {
      val.forEach(el => {
        el.ticket.state = el.ticket.checkin === true ? '已签到' : '未签到'
      })
    }
  },
  methods: {
    enter () {
      api.get(`search/${this.key}/${this.value}`).then(result => {
        this.tickets = result.data
      })
    },
    checkin (t) {
      api.get(`check/${t.ticket.ticket_no}`).then(result => {
        console.log(result.data)
        if (result.data.msg === '-1') {
          this.$message.error('未找到相应门票')
        } else if (result.data.msg === '1') {
          this.$message.error('该门票已签到')
        } else {
          this.$message.success('签到成功')
          this.enter()
        }
      }).catch(err => {
        console.log(err)
        alert('没找到相关票!')
      })
    },
    cancel (t) {
      api.get(`cancel/${t.ticket.ticket_no}`).then(result => {
        this.$message.success('取消成功')
        this.enter()
      })
    }
  }
}
</script>

<style scoped>
  #query {
    text-align: left;
  }
  .input {
    width: 200px;
    height: 20px;
    font-size: 18px;
    outline: none;
    padding: 6px;
    margin-left: 10px;
    text-align: left;
    vertical-align: bottom;
  }
  .el-table {
    font-size: 40%;
  }
</style>
