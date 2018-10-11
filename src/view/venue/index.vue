<template>
  <div>
    <Card>
      <Button style="margin: 10px 0;" type="primary" @click="showModal = true">新增</Button>
      <tables ref="tables"
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-update="update"
        @on-delete="_deleteStore"
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
            <Select v-model="model1" style="width:200px">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Row>
        </FormItem>
        <FormItem label="是否热门">
              <i-switch v-model="switch1" @on-change="changeIshot" />
        </FormItem>
        <FormItem label="图片">
          <Row>
            <Col span="24">
            <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index"  @mouseover="uploadImgIcon = true" @mouseout="uploadImgIcon = false">
                <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover" v-show="uploadImgIcon" >
                        <Icon type="ios-eye-outline"  @click.native="handleView(item.name)"></Icon>
                        <Icon type="ios-trash-outline"  @click.native="handleRemove(item)"></Icon>
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
              :data="uploadImgData"
              action="http://47.92.217.9:9091/rest/common/uploadImg"
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
import Tables from '_c/tables'
import EditDialog from '_c/edit-dialog'
import { getStoreList, createStore, updateStore, deleteStore } from '@/api/vuene'
import { uploadImg } from '@/api/common'
// const DISCOUNT_TYPE = [
//   { label: '满减', value: '' },
//   { label: '折扣', value: '' },
// ]
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
          'status': 'finished',
          'name': 'a42bdcc1178e62b4694c830f028db5c0',
          'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
        }
      ],
      imgName: '',
      uploadImgData: {
        type: 'store'
      },
      visible: false,
      uploadImgIcon: false,
      uploadList: [
        {
          'status': 'finished',
          'name': 'a42bdcc1178e62b4694c830f028db5c0',
          'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
        }
      ],
      cityList: [
        {
          value: 'New York',
          label: 'New York'
        },
        {
          value: 'London',
          label: 'London'
        }
      ],
      model1: '',
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
            key: 'discountContent',
            index: 1,
            status: 1,
            name: '返利'
          }, {
            value: '',
            key: 'address',
            index: 1,
            status: 1,
            name: '详细地址'
          },
          {
            value: '',
            key: 'contactName',
            index: 1,
            status: 1,
            name: '联系人姓名'
          },
          {
            value: '',
            key: 'contactPhone',
            index: 1,
            status: 1,
            name: '联系人手机号'
          },
          {
            value: '',
            key: 'starLevel',
            index: 1,
            status: 1,
            name: '星级'
          },
          {
            value: '',
            key: 'contactPhone',
            index: 1,
            status: 1,
            name: 'inStuNums'
          },
          {
            value: '',
            key: 'starLevel',
            index: 1,
            status: 1,
            name: '折扣百分比'
          }
        ]
      },
      switch1: false,
      columns: [
        { title: '名称', key: 'name', sortable: true, editable: true },
        { title: '返利', key: 'discountContentMessage', editable: true },
        { title: '联系人', key: 'contactName', editable: true },
        { title: '地址', key: 'address', editable: true },
        { title: '城市', key: 'city' },
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
    init () {
      this._getStoreList({ pageSze: '1' })
    },
    // save
    save () {
      let data = {}
      this.formDynamic.items.forEach(e => {
        data[e.key] = e.value
      })
      this._createStore(data)
    },
    update (params) {
      console.log(params)
    },
    // check ishot
    changeIshot () {},
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
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
      console.log('删除')
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
        this.init()
        this.showModal = false
      })
    },
    _updateStore (data) {
      updateStore(data).then(res => {
        console.log(res)
      })
    },
    _deleteStore (params) {
      deleteStore({ id: params.row.id }).then(res => {
        this.init()
      })
    },
    _getStoreList (data) {
      getStoreList(data).then(res => {
        this.tableData = res.pageList.list
        this.storeTotal = res.pageList.count
      })
    },
    _uploadImg (data) {
      uploadImg(data).then(res => {
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
.demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
}
.demo-upload-list img {
    width: 100%;
    height: 100%;
}
.demo-upload-list-cover {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
}
.demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}
</style>
