<template>
  <div>
    <Card>
      <Button style="margin: 10px 0;" type="primary" @click="showModal = true">新增城市</Button>
      <tables ref="tables"
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-delete="deleteCity"
        @on-save-edit="saveEdit"/>
      <!-- page -->
      <Row type="flex" justify="end">
        <Col>
          <Page :total="rebateTotal" :page-size="pageSize" show-total />
        </Col>
      </Row>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
      <!-- 编辑 -->
      <edit-dialog :showModal="showModal" :formDynamic="formDynamic"  @save="save"></edit-dialog>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import EditDialog from '_c/edit-dialog'
import { getRebateList, createRebate, deleteRebate, updateRebate } from '@/api/rebate'

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
      showModal: false,
      formDynamic: {
        items: [
          {
            value: '',
            key: 'name',
            index: 1,
            status: 1,
            name: '名称'
          },
          {
            value: '',
            key: 'shortName',
            index: 1,
            status: 1,
            name: '简称'
          }
        ]
      },
      columns: [
        { title: '用户ID', key: 'clientId', sortable: true, editable: true },
        { title: '场馆', key: 'storeName', sortable: true, editable: true },
        { title: '总金额', key: 'consumeMoney', editable: true },
        { title: '返利金额', key: 'returnMoney', editable: true },
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
                  props: {},
                  style: {
                    'margin-right': '10px'
                  },
                  on: {
                    'click': () => {
                      vm.$emit('on-update', params)
                      console.log('122222222')
                    }
                  }
                }, '作废'),
                h('Button', {
                  props: {},
                  on: {
                    'click': () => {
                      vm.$emit('on-update', params)
                      console.log('122222222')
                    }
                  }
                }, '返利')
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
      this._getRebateList({ pageSize: 5, pageNumber: 1, rebateSo: {} })
    },
    // 保存
    save () {
      let data = {}
      this.formDynamic.items.forEach(e => {
        data[e.key] = e.value
      })
      data.type = 2
      this._createRebate(JSON.stringify(data))
    },
    saveEdit () {},
    deleteRebate (params) {
      this._deleteRebate({ id: params.row.id })
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    /*
    * api func
    */
    _createRebate (data) {
      createRebate(data).then(res => {
        this.init()
        this.showModal = false
      })
    },
    _updateRebate (data) {
      updateRebate(data).then(res => {
        console.log(res)
      })
    },
    _deleteRebate (params) {
      deleteRebate(params).then(res => {
        this.init()
      })
    },
    _getRebateList (data) {
      getRebateList(data).then(res => {
        console.log(res)
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
