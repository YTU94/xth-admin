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
        { title: '姓名', key: 'name', sortable: true, editable: true },
        { title: '电话', key: 'phone', editable: true },
        { title: '特长', key: 'speciality', editable: true },
        { title: '性别', key: 'gender', editable: true },
        // { title: '联系人', key: 'contactName', editable: true },
        {
          title: '操作1',
          key: 'handle',
          options: ['delete'],
          render: [
            (h, params, vm) => {
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要删除jiaolian吗?'
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
    save () {
      createCoach({}).then(res => {
        console.log(res)
      })
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    _updateCoach (data) {
      updateCoach(data).then(res => {
        console.log(res)
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
