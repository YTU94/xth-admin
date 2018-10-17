<template>
  <div>
    <Card>
      <!-- <Button style="margin: 10px 0;" type="primary" @click="showModal = true">新增城市</Button> -->
      <tables ref="tables"
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-delete="deleteClient"
        @on-save-edit="saveEdit"/>
      <!-- page -->
      <Row type="flex" justify="end">
        <Col>
          <Page :total="clientTotal" show-total />
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
import { getClientList, deleteClient, updateClient } from '@/api/user'
import { getDate } from '@/libs/tools.js'

export default {
  name: 'tables_page',
  components: {
    Tables,
    EditDialog
  },
  data () {
    return {
      clientTotal: 0,
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
        { title: '客户ID', key: 'id', sortable: true, editable: true },
        { title: '昵称', key: 'nickname', editable: true },
        { title: '手机号', key: 'mobile', editable: true },
        { title: 'openId', key: 'openId', editable: true },
        { title: '创建时间', key: 'createdTimeDate', editable: true },
        { title: '最后一次登陆时间', key: 'lastLoginTimeDate', editable: true },
        {
          title: '操作',
          key: 'handle',
          fixed: 'right',
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
      this._getClientList({ pageSize: 5, pageNumber: 1, clientSo: {} })
    },
    // 保存
    save () {
      let data = {}
      this.formDynamic.items.forEach(e => {
        data[e.key] = e.value
      })
      data.type = 2
      this._createClient(JSON.stringify(data))
    },
    saveEdit () {},
    deleteClient (params) {
      this._deleteClient({ id: params.row.id })
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    /*
    * api func
    */
    _updateClient (data) {
      updateClient(data).then(res => {
        console.log(res)
      })
    },
    _deleteClient (params) {
      deleteClient(params).then(res => {
        this.init()
      })
    },
    _getClientList (data) {
      getClientList(data).then(res => {
        console.log(res)
        res.pageList.list.forEach(e => {
          if (e.hasOwnProperty('createdTime')) {
            e.createdTimeDate = getDate(e.createdTime, 'year')
            e.lastLoginTimeDate = getDate(e.lastLoginTime, 'year')
          }
        })
        this.tableData = res.pageList.list
        this.clientTotal = res.pageList.count
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
