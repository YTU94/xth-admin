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
        @on-save-edit="saveEdit"/>
      <!-- page -->
      <Row type="flex" justify="end">
        <Col>
          <Page :total="storeTotal" show-total />
        </Col>
      </Row>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
      <!-- 编辑 -->
      <edit-dialog :showModal="showModal" :formDynamic="formDynamic"></edit-dialog>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import EditDialog from '_c/edit-dialog'
import { getCityList, createCity, deleteCity, updateCity } from '@/api/coach'

export default {
  name: 'tables_page',
  components: {
    Tables,
    EditDialog
  },
  data () {
    return {
      storeTotal: 0,
      showModal: false,
      formDynamic: {
        items: [
          {
            value: '',
            index: 1,
            status: 1,
            name: '名称'
          },
          {
            value: '',
            index: 1,
            status: 1,
            name: '返利'
          }, {
            value: '',
            index: 1,
            status: 1,
            name: '地址'
          },
          {
            value: '',
            index: 1,
            status: 1,
            name: '联系人'
          }
        ]
      },
      columns: [
        { title: '名称', key: 'name', sortable: true, editable: true },
        { title: '返利', key: 'discountContentMessage', editable: true },
        { title: '联系人', key: 'contactName', editable: true },
        { title: '地址', key: 'address', editable: true },
        // { title: '联系人', key: 'contactName', editable: true },
        {
          title: '操作',
          key: 'handle',
          options: ['delete'],
          button: [
            (h, params, vm) => {
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要删除吗?'
                },
                on: {
                  'on-ok': () => {
                    vm.$emit('deleteStore', params)
                  }
                }
              })
            }
          ]
        }
      ],
      tableData: []
    }
  },
  methods: {
    init () {
      this._getCityList({ pageSize: 1 })
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    deleteStore (params) {
      console.log(params, '走接口删除')
      params.tableData.filter((item, index) => index !== params.row.initRowIndex)
    },
    saveEdit (params) {
      console.log(params, '保存编辑')
      params.row.name = params.column.name
    },
    /*
    * api func
    */
    _createCity (data) {
      createCity(data).then(res => {
        this.refresh()
      })
    },
    _updateCity (data) {
      updateCity(data).then(res => {
        console.log(res)
      })
    },
    _deleteCity (params) {
      deleteCity({ id: params.row.id }).then(res => {
        this.refresh()
      })
    },
    _getCityList (data) {
      getCityList(data).then(res => {
        console.log(res)
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
