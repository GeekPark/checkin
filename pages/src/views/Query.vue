<template lang="jade">
#query
  el-select(v-model='search', placeholder='请选择')
    el-option(v-for='item in options', :label='item.label', :value='item.value')
  input.input(v-model='input', placeholder='回车搜索')
  p &nbsp
  el-table(:data='tickets', border)
    el-table-column(prop='date', label='票种', width='180')
    el-table-column(prop='name', label='取票号码', width='180')
    el-table-column(prop='address', label='姓名')
    el-table-column(prop='address', label='邮箱')
    el-table-column(prop='address', label='电话')
    el-table-column(prop='address', label='职能')
    el-table-column(prop='address', label='职位')
    el-table-column(prop='address', label='公司')
    el-table-column(prop='address', label='订单信息')
    el-table-column(prop='address', label='订单号')
</template>

<script>
import api from '../vuex/api'
export default {
  data () {
    return {
      tickets: [],
      search: 'phone',
      input: '',
      options: [{
        value: 'phone',
        label: '手机号'
      }, {
        value: 'name',
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
  methods: {
    enter () {
      api.get('')
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
</style>
