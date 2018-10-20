<template>
  <div>
    <Card>
      <tables ref="tables"
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-pass="passRebateOrder"
        @on-invalid="invalidRebateOrder"/>
      <!-- page -->
      <Row type="flex" justify="end">
        <Col>
          <Page :total="rebateTotal" :page-size="pageSize" @on-change="pageChange" show-total />
        </Col>
      </Row>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import EditDialog from '_c/edit-dialog'
import { getRebateList, passRebate, inactiveRebate } from '@/api/rebate'

export default {
  name: 'tables_page',
  components: {
    Tables,
    EditDialog
  },
  data () {
    return {
      pageSize: 5,
      rebateTotal: 0,
      columns: [
        { title: '用户ID', key: 'clientId', sortable: true, editable: true },
        { title: '场馆', key: 'storeName', sortable: true, editable: true },
        { title: '总金额', key: 'consumeMoney', editable: true },
        { title: '返利金额', key: 'returnMoney', editable: true },
        { title: '状态', key: 'statusName', editable: true },
        {
          title: '凭证',
          key: 'img',
          options: ['delete'],
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.attachment || 'https://secure.gravatar.com/avatar/5e549e9992e2f6a350efd704e9d56036?s=50&r=pg&d=https%3A%2F%2Fdeveloper.mozilla.org%2Fstatic%2Fimg%2Favatar.png'
              },
              style: {
                width: '80px',
                height: 'auto'
              },
              on: {
                'click': () => {
                  console.log(params)
                }
              }
            }, '编辑')
          }
        },
        {
          title: '操作',
          key: 'handle',
          // options: ['delete'],
          button: [
            (h, params, vm) => {
              return [
                h('Button', {
                  props: {
                    type: 'primary'
                  },
                  style: {
                    'margin-right': '10px'
                  },
                  on: {
                    'click': () => {
                      vm.$emit('on-pass', params)
                      console.log('122222222')
                    }
                  }
                }, '返利'),
                h('Button', {
                  props: {
                    type: 'error'
                  },
                  on: {
                    'click': () => {
                      vm.$emit('on-invalid', params)
                      console.log('122222222')
                    }
                  }
                }, '作废')
              ]
            }
          ]
        }
      ],
      tableData: []
    }
  },
  methods: {
    init () {
      this._getRebateList({ pageSize: this.pageSize, pageNumber: 1, rebateSo: {} })
    },
    // 改变页码
    pageChange (v) {
      this._getRebateList({ pageSize: this.pageSize, pageNumber: v })
    },
    passRebateOrder (params) {
      this._passRebate({ id: params.row.id })
    },
    invalidRebateOrder (params) {
      this._inactiveRebate({ id: params.row.id })
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    /*
    * api func
    */
    _inactiveRebate (data) {
      inactiveRebate(data).then(res => {
        this.init()
      })
    },
    _passRebate (params) {
      passRebate(params).then(res => {
        this.init()
      })
    },
    _getRebateList (data) {
      getRebateList(data).then(res => {
        console.log(res)
        res.pageList.list.forEach(e => {
          e.statusName = e.status === 'SUBMITED' ? '已提交' : (e.status === 'INACTIVE' ? '已作废' : '已返利')
        })
        this.tableData = res.pageList.list
        this.rebateTotal = res.pageList.count
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less">

</style>
