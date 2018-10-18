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
          <Page :total="cityTotal" :page-size="pageSize" @on-change="pageChange" show-total />
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
import { getCityList, createCity, deleteCity, updateCity } from '@/api/city'

export default {
  name: 'tables_page',
  components: {
    Tables,
    EditDialog
  },
  data () {
    return {
      pageSize: 5,
      cityTotal: 0,
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
        { title: '名称', key: 'name', sortable: true },
        { title: '简称', key: 'shortName' },
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
                })
                // h('Button', {
                //   props: {},
                //   on: {
                //     'click': () => {
                //       vm.$emit('on-update', params)
                //       console.log('122222222')
                //     }
                //   }
                // }, '编辑')
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
      this._getCityList({ pageSize: this.pageSize, pageNumber: 1, citySo: {} })
    },
    // 保存
    save () {
      let data = {}
      this.formDynamic.items.forEach(e => {
        data[e.key] = e.value
      })
      data.type = 2
      this._createCity(JSON.stringify(data))
    },
    // 改变页码
    pageChange (v) {
      this._getCityList({ pageSize: this.pageSize, pageNumber: v })
    },
    saveEdit () {},
    deleteCity (params) {
      this._deleteCity({ id: params.row.id })
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    /*
    * api func
    */
    _createCity (data) {
      createCity(data).then(res => {
        this.init()
        this.showModal = false
      })
    },
    _updateCity (data) {
      updateCity(data).then(res => {
        console.log(res)
      })
    },
    _deleteCity (params) {
      deleteCity(params).then(res => {
        this.init()
      })
    },
    _getCityList (data) {
      getCityList(data).then(res => {
        console.log(res)
        this.tableData = res.pageList.list
        this.cityTotal = res.pageList.count
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
