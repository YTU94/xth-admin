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
        <FormItem label="城市">
          <Row>
            <Col span="24">
            <Select v-model="model1" style="width:200px">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="是否热门">
              <i-switch v-model="switch1" @on-change="change" />
        </FormItem>
        <FormItem label="图片">
          <Row>
            <Col span="24">
            <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
                <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                    </div>
                </template>
                <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
            </div>
            <Upload
              ref="upload"
              :show-upload-list="false"
              :default-file-list="defaultList"
              :on-success="handleSuccess"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              multiple
              type="drag"
              action="//jsonplaceholder.typicode.com/posts/"
              style="display: inline-block;width:58px;">
              <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
            <Modal title="View Image" v-model="visible">
                <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
            </Modal>
            </Col>
          </Row>
        </FormItem>
      </edit-dialog>
    </Card>
  </div>
</template>

<script>
import axios from 'axios'
import Tables from '_c/tables'
import EditDialog from '_c/edit-dialog'
import { getStoreList, createStore, updateStore, deleteStore } from '@/api/vuene'

export default {
  name: 'tables_page',
  components: {
    Tables,
    EditDialog
  },
  data () {
    return {
      title: '新增场馆',
      defaultList: [
        {
          'name': 'a42bdcc1178e62b4694c830f028db5c0',
          'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
        },
        {
          'name': 'bc7521e033abdd1e92222d733590f104',
          'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
        }
      ],
      imgName: '',
      visible: false,
      uploadList: [],
      cityList: [
        {
          value: 'New York',
          label: 'New York'
        },
        {
          value: 'London',
          label: 'London'
        },
        {
          value: 'Sydney',
          label: 'Sydney'
        },
        {
          value: 'Ottawa',
          label: 'Ottawa'
        },
        {
          value: 'Paris',
          label: 'Paris'
        },
        {
          value: 'Canberra',
          label: 'Canberra'
        }
      ],
      model1: '',
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
            name: '联系人姓名'
          },
          {
            value: '',
            index: 1,
            status: 1,
            name: '联系人手机号'
          }
        ]
      },
      switch1: false,
      columns: [
        { title: '名称', key: 'name', sortable: true, editable: true },
        { title: '返利', key: 'discountContentMessage', editable: true },
        { title: '联系人', key: 'contactName', editable: true },
        { title: '地址', key: 'address', editable: true },
        { title: '城市',
          key: 'city',
          options: ['delete'],
          render: (h, params) => {
            return h('div', [
              h('upload', {
                props: {
                  action: '//jsonplaceholder.typicode.com/posts'
                }
              }),
              h('strong', params.row.name)
            ])
          }
        },
        {
          title: '图片',
          key: 'img',
          options: ['delete'],
          render: (h, params) => {
            return h('div', [
              h('upload', {
                props: {
                  action: '//jsonplaceholder.typicode.com/posts'
                }
              }),
              h('strong', params.row.name)
            ])
          }
          // (h, params, vm) => {
          //   return h('upload', {
          //     props: {
          //       action: '//jsonplaceholder.typicode.com/posts/'
          //     }
          //   }, [
          //     (h, params, vm) => {
          //       return h('button', {
          //         props: {
          //           icon: 'ios-cloud-upload-outline'
          //         }
          //       }, '上传图片')
          //     }
          //   ], 'text')
          // }
        },
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
    // save
    save () {
      // const data = { ...this.formDynamic }
      this._createStore({})
    },
    change () {},
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
    // 图片管理
    handleView (name) {
      this.imgName = name
      this.visible = true
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess (res, file) {
      file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'
      file.name = '7eb99afb9d5f317c912f08b5212fd69a'
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      })
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 5
      if (!check) {
        this.$Notice.warning({
          title: 'Up to five pictures can be uploaded.'
        })
      }
      return check
    },
    /*
    * api func
    */
    _createStore (data) {
      createStore(data).then(res => {
        console.log(res)
      })
    },
    _updateStore (data) {
      updateStore(data).then(res => {
        console.log(res)
      })
    },
    _deleteStore (data) {
      deleteStore(data).then(res => {
        console.log(res)
      })
    },
    _getStoreList (data) {
      getStoreList(data).then(res => {
        console.log(res)
      })
    }
  },
  mounted () {
    axios.request({
      url: 'http://47.92.217.9:9090/rest/store/listPagination',
      method: 'POST',
      data: { pageSze: 1 }
    }).then(res => {
      console.log(res)
    })
    getStoreList({ pageSze: '1' }).then(res => {
      this.tableData = res.pageList.list
      this.storeTotal = res.pageList.count
    })
  }
}
</script>

<style lang="less">

</style>
