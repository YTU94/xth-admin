<template>
  <div>
    <Card>
      <Button style="margin: 10px 0;" type="primary" @click="showModal = true">新增</Button>
      <tables ref="tables"
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
        @save="save">
        <FormItem label="场馆">
          <Row>
            <Select v-model="curStoreId" style="width:200px">
              <Option v-for="(item, index) in storeList" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
          </Row>
        </FormItem>
      </edit-dialog>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import EditDialog from '_c/edit-dialog'
import { getCoachList, createCoach, deleteCoach, updateCoach } from '@/api/coach'
import { getStoreList } from '@/api/vuene'

export default {
  name: 'tables_page',
  components: {
    Tables,
    EditDialog
  },
  data () {
    return {
      title: '新增教练',
      curStoreId: '',
      storeList: [],
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
          },
          {
            value: '',
            key: 'idNumber',
            index: 1,
            status: 1,
            name: '身份证号'
          }, {
            value: '',
            key: 'gender',
            index: 1,
            status: 1,
            name: '性别'
          }, {
            value: '',
            key: 'starLevel',
            index: 1,
            status: 1,
            name: '星级'
          }, {
            value: '',
            key: 'ccieNum',
            index: 1,
            status: 1,
            name: '证书数量'
          }, {
            value: '',
            key: 'classNum',
            index: 1,
            status: 1,
            name: '课程数量'
          }, {
            value: '',
            key: 'speciality',
            index: 1,
            status: 1,
            name: '特长'
          }
        ]
      },
      columns: [
        { title: '姓名', key: 'name', sortable: true, editable: true },
        { title: '电话', key: 'phone', editable: true },
        { title: '身份证号', key: 'idNumber', editable: true },
        { title: '性别', key: 'gender', editable: true },
        { title: '星级', key: 'starLevel', editable: true },
        { title: '证书数量', key: 'ccieNum', editable: true },
        { title: '课程数量', key: 'classNum', editable: true },
        { title: '特长', key: 'speciality', editable: true },
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
      this._getCoachList({ pageSze: '1' })
      this._getAllStoreList({})
    },
    save () {
      const data = {}
      this.formDynamic.items.forEach(e => {
        data[e.key] = e.value
      })
      data.storeId = this.curStoreId
      this._createCoach(data)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    handleDelete (params) {
      deleteCoach({ id: params.row.id }).then(res => {
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
    _getAllStoreList (data) {
      getStoreList(data).then(res => {
        this.storeList = res.pageList.list
      })
    },
    _createCoach (data) {
      createCoach(data).then(res => {
        this.init()
        this.showModal = false
      })
    },
    _updateCoach (data) {
      updateCoach(data).then(res => {
        console.log(res)
      })
    },
    _deleteCoach (params) {
      deleteCoach({ id: params.row.id }).then(res => {
        this.init()
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
    this.init()
  }
}
</script>

<style lang="less">

</style>
