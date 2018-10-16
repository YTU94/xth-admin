<template>
  <div>
    <Card>
      <Button style="margin: 10px 0;" type="primary" @click="showModal = true">新增城市</Button>
      <tables ref="tables"
        editable
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-delete="deleteCity"
        @on-save-edit="saveEdit"/>
      <!-- page -->
      <Row type="flex" justify="end">
        <Col>
          <Page :total="cityTotal" show-total />
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
        { title: '名称', key: 'name', sortable: true, editable: true },
        { title: '简称', key: 'shortName', editable: true },
        // { title: '联系人', key: 'contactName', editable: true },
        {
          title: '操作',
          key: 'handle',
          options: ['delete'],
          button: [
            (h, params, vm) => {
              return [
                h('Poptip', {
                  props: {
                    confirm: true,
                    title: '你确定要删除吗?'
                  },
                  on: {
                    'on-ok': () => {
                      vm.$emit('on-delete', params)
                    }
                  }
                }),
                h('Button', {
                  props: {},
                  on: {
                    'click': () => {
                      vm.$emit('on-update', params)
                      console.log('122222222')
                    }
                  }
                }, '编辑')
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
