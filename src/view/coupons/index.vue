<template>
  <div>
    <Card>
      <Button style="margin: 10px 0;" type="primary" @click="showModal = true">新增</Button>
      <tables ref="tables"
        editable
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-delete="deleteHandle"
        @on-save-edit="saveEdit"/>
      <!-- page -->
      <Row type="flex" justify="end">
        <Col>
          <Page :total="storeTotal" show-total />
        </Col>
      </Row>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
      <!-- 编辑 -->
      <edit-dialog :showModal="showModal" :formDynamic="formDynamic" @save="save"></edit-dialog>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import EditDialog from '_c/edit-dialog'
import { getCouponList, createCoupon, deleteCoupon, updateCoupon } from '@/api/coupon'

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
            key: 'name',
            index: 1,
            status: 1,
            name: '名称'
          },
          {
            value: '',
            key: 'content',
            index: 1,
            status: 1,
            name: '内容'
          }, {
            value: '',
            key: 'applyScopeContent',
            index: 1,
            status: 1,
            name: '使用范围'
          },
          {
            value: '',
            key: 'type',
            index: 1,
            status: 1,
            name: '类型'
          }
        ]
      },
      columns: [
        { title: '名称', key: 'name', sortable: true, editable: true },
        { title: '内容', key: 'content', editable: true },
        { title: '使用范围', key: 'applyScopeContent', editable: true },
        { title: '类型', key: 'type', editable: true },
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
      this._getCouponList({ pageSze: 1 })
    },
    // save
    save () {
      let data = {}
      this.formDynamic.items.forEach(e => {
        data[e.key] = e.value
      })
      this._createCoupon(data)
    },
    deleteHandle (params) {
      this._deleteCoupon({ id: params.row.id })
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
    _createCoupon (data) {
      createCoupon(data).then(res => {
        this.init()
        this.showModal = false
      })
    },
    _updateCoupon (data) {
      updateCoupon(data).then(res => {
        console.log(res)
      })
    },
    _deleteCoupon (params) {
      // params.tableData.filter((item, index) => index !== params.row.initRowIndex)
      deleteCoupon(params).then(res => {
        this.init()
      })
    },
    _getCouponList (data, merge) {
      getCouponList(data).then(res => {
        res.pageList.list.forEach(e => {
          e.content = `满${e.contentList[0]}减${e.contentList[1]}元`
        })
        this.tableData = res.pageList.list
        this.storeTotal = res.pageList.count
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
