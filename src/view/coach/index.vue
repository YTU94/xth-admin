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
        @on-delete="handleDelete"
        @on-save-edit="saveEdit"/>
      <!-- page -->
      <Row type="flex" justify="end">
        <Col>
          <Page :total="storeTotal" show-total />
        </Col>
      </Row>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
      <!-- 编辑 -->
      <edit-dialog
        :title="title"
        :showModal="showModal"
        :formDynamic="formDynamic"
        @save="save"></edit-dialog>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import EditDialog from '_c/edit-dialog'
import { getCoachList, createCoach, deleteCoach, updateCoach } from '@/api/coach'

export default {
  name: 'tables_page',
  components: {
    Tables,
    EditDialog
  },
  data () {
    return {
      title: '新增教练',
      storeTotal: 0,
      showModal: false,
      formDynamic: {
        items: [
          {
            value: '',
            key: 'name',
            index: 1,
            status: 1,
            name: '姓名'
          },
          {
            value: '',
            key: 'phone',
            index: 1,
            status: 1,
            name: '电话'
          }, {
            value: '',
            key: 'speciality',
            index: 1,
            status: 1,
            name: '特长'
          },
          {
            value: '',
            key: 'gender',
            index: 1,
            status: 1,
            name: '性别'
          }
        ]
      },
      columns: [
        { title: '姓名', key: 'name', sortable: true, editable: true },
        { title: '电话', key: 'phone', editable: true },
        { title: '特长', key: 'speciality', editable: true },
        { title: '性别', key: 'gender', editable: true },
        // { title: '联系人', key: 'contactName', editable: true },
        {
          title: '图片',
          key: 'img',
          options: ['delete'],
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.imgUrl || 'https://secure.gravatar.com/avatar/5e549e9992e2f6a350efd704e9d56036?s=50&r=pg&d=https%3A%2F%2Fdeveloper.mozilla.org%2Fstatic%2Fimg%2Favatar.png'
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
    save () {
      const data = {}
      this.formDynamic.items.forEach(e => {
        data[e.key] = e.value
      })
      this._createCoach(data)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    handleDelete (params) {
      deleteCoach({ id: params.row.id }).then(res => {
        debugger
        console.log(params, '走接口删除')
        params.tableData.filter((item, index) => index !== params.row.initRowIndex)
      })
    },
    deleteStore (params) {
      deleteCoach({ id: params.id }).then(res => {
        debugger
        console.log(params, '走接口删除')
        params.tableData.filter((item, index) => index !== params.row.initRowIndex)
      })
    },
    saveEdit (params) {
      console.log(params, '保存编辑')
      params.row.name = params.column.name
    },
    /*
    * api func
    */
    _createCoach (data) {
      createCoach(data).then(res => {
        this.refresh()
      })
    },
    _updateCoach (data) {
      updateCoach(data).then(res => {
        console.log(res)
      })
    },
    _deleteCoach (params) {
      deleteCoach({ id: params.row.id }).then(res => {
        this.refresh()
      })
    },
    _getCoachList (data) {
      getCoachList(data).then(res => {
        this.tableData = res.pageList.list
        this.storeTotal = res.pageList.count
      })
    }
  },
  mounted () {
    getCoachList({ pageSze: '1' }).then(res => {
      this.tableData = res.pageList.list
      this.storeTotal = res.pageList.count
    })
  }
}
</script>

<style lang="less">

</style>
