<template>
  <div>
    <Card>
      <Button style="margin: 10px 0;" type="primary" @click="showModel = true">新增</Button>
      <tables ref="tables"
        editable
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-delete="handleDelete"/>
        <Page :total="100" show-total />
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
      <!-- 编辑 -->
      <edit-dialog :showModel="showModel"></edit-dialog>
      {{tableData[0]}}
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import EditDialog from '_c/edit-dialog'
import { getStoreList } from '@/api/vuene'
// import axios from 'axios'
export default {
  name: 'tables_page',
  components: {
    Tables,
    EditDialog
  },
  data () {
    return {
      showModel: false,
      columns: [
        { title: '名称', key: 'name', sortable: true, editable: true },
        { title: '返利', key: 'discountContentMessage', editable: true },
        { title: '联系人', key: 'contactName', editable: true },
        { title: '地址', key: 'address', editable: true },
        { title: '联系人', key: 'contactName', editable: true },
        {
          title: 'Handle',
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
                    vm.$emit('on-delete', params)
                    vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
                  }
                }
              }, [
                h('Button', '删除')
              ])
            },
            (h, params, vm) => {
              return h('Button', '编辑2')
            }
          ]
        }
      ],
      tableData: []
    }
  },
  methods: {
    handleDelete (params) {
      console.log(params)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    }
  },
  mounted () {
    getStoreList({ pageSze: '1' }).then(res => {
      this.tableData = res.pageList.list
    })
  }
}
</script>

<style lang="less">

</style>
