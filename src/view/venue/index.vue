<template>
  <div>
    <Card>
      <Button style="margin: 10px 0;" type="primary" @click="showModal = true">新增</Button>
      <Upload
        style="display: inline-block;margin-left:20px;"
        :show-upload-list="Boolean(false)"
        :on-success="importStroeSuccess"
        :format="['jpg','jpeg','png', 'xlsx']"
        action="http://47.92.217.9:9091/rest/store/import">
        <Button icon="ios-cloud-upload-outline">模板导入</Button>
      </Upload>
      <tables ref="tables"
        searchable
        :value="tableData"
        :columns="columns"
        @on-selection-change="selectChange"
        @on-update="update"
        @on-delete="_deleteStore"
        @on-save-edit="saveEdit"/>
      <!-- page -->
      <Row type="flex" justify="end">
        <Col>
          <Page :total="storeTotal" :page-size="pageSize" @on-change="pageChange" show-total />
        </Col>
      </Row>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Xlsx文件</Button>
      <!-- 编辑 -->
      <edit-dialog
        :title="title"
        :showModal="showModal"
        :formDynamic="formDynamic"
        @save="save"
        @cancel="cancel">
        <FormItem label="城市">
          <Row>
            <Select v-model="selectCityId" v-if="cityList && cityList.length > 0" style="width:200px">
              <Option v-if="item" v-for="(item, index) in cityList" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
          </Row>
        </FormItem>
        <FormItem label="是否热门">
              <i-switch v-model="switch1" @on-change="changeIshot" />
        </FormItem>
        <FormItem label="图片">
          <Row>
            <Col span="24">
            <div class="demo-upload-list" v-if="uploadList && uploadList.length > 0" v-for="(item, index) in uploadList" :key="index"  @mouseover="uploadImgIcon = true" @mouseout="uploadImgIcon = false">
                <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover" v-show="uploadImgIcon" >
                        <Icon type="ios-eye-outline"  @click.native="handleView(item.name)"></Icon>
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
              :on-success="uploadImgSuccess"
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
              <img :src="curStoreImg" v-if="visible && curStoreImg" style="width: 100%">
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
import { getStoreList, createStore, updateStore, deleteStore, exportStore } from '@/api/vuene'
import { getCityList } from '@/api/city'
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
      pageSize: 5,
      tableData: [],
      title: '新增场馆',
      defaultList: [
        {
          'status': 'finished',
          'name': 'a42bdcc1178e62b4694c830f028db5c0',
          'url': ''
        }
      ],
      imgName: '',
      uploadImgData: {
        imgType: 'store'
      },
      // 新增选择的img
      curStoreImg: '',
      // 选择门店id list
      selectStoreIdList: [],
      importStroeData: '',
      visible: false,
      uploadImgIcon: false,
      uploadList: [],
      cityList: [],
      selectCityId: '',
      storeTotal: 0,
      showModal: false,
      formDynamic: {
        items: [
          {
            value: '杭州渣渣辉店',
            key: 'name',
            index: 1,
            status: 1,
            name: '名称'
          },
          {
            value: '7',
            key: 'discountContent',
            index: 1,
            status: 1,
            name: '返利'
          }, {
            value: '西斗门路77号',
            key: 'address',
            index: 1,
            status: 1,
            name: '详细地址'
          },
          {
            value: '李四',
            key: 'contactName',
            index: 1,
            status: 1,
            name: '联系人姓名'
          },
          {
            value: '182312413',
            key: 'contactPhone',
            index: 1,
            status: 1,
            name: '联系人手机号'
          },
          {
            value: '2',
            key: 'starLevel',
            index: 1,
            status: 1,
            name: '星级'
          },
          {
            value: '100',
            key: 'inStuNums',
            index: 1,
            status: 1,
            name: '在馆学员人数'
          },
          {
            value: '9',
            key: 'starLevel',
            index: 1,
            status: 1,
            name: '折扣百分比'
          }
        ]
      },
      switch1: false,
      columns: [
        {
          type: 'selection',
          key: 'handle',
          width: 60,
          align: 'center'
        },
        { title: '名称', key: 'name', sortable: true },
        { title: '返利', key: 'discountContentMessage' },
        { title: '联系人姓名', key: 'contactName' },
        { title: '联系人电话', key: 'contactPhone' },
        { title: '城市', key: 'city' },
        { title: '地址', key: 'address' },
        { title: '在馆学员人数', key: 'inStuNums' },
        { title: '热门度', key: 'hotLevel' },
        { title: '星级', key: 'starLevel' },
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
          fixed: 'right',
          width: 150,
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
      ]
    }
  },
  methods: {
    init (city) {
      this._getStoreList({ pageSize: 5, pageNumber: 1 })
      if (city) {
        this._getCityList({})
      }
    },
    // save
    save () {
      let data = {}
      this.formDynamic.items.forEach(e => {
        data[e.key] = e.value
      })
      data.imgUrl = this.curStoreImg
      data.discountType = 'RATE' //
      data.cityId = this.selectCityId || 0
      this._createStore(data)
    },
    cancel () {
      this.showModal = false
    },
    update (params) {
      console.log(params)
    },
    // 改变页码
    pageChange (v) {
      this._getStoreList({ pageSize: this.pageSize, pageNumber: v })
    },
    // table select change 表格勾选
    selectChange (selection) {
      console.log(selection)
      this.selectStoreIdList = selection.map(e => {
        return e.id
      })
    },
    // check ishot
    changeIshot () {},
    exportExcel () {
      if (this.selectStoreIdList.length < 1) {
        this.$Message.error('请选择要到处的场馆')
        return false
      }
      exportStore({ idList: this.selectStoreIdList }).then(res => {
        if (res.vo) {
          location.href = res.vo
        }
        // const content = res
        // const blob = new Blob([content])
        // const fileName = '场馆.xlsx'
        // if ('download' in document.createElement('a')) { // 非IE下载
        //   const elink = document.createElement('a')
        //   elink.download = fileName
        //   elink.style.display = 'none'
        //   elink.href = URL.createObjectURL(blob)
        //   document.body.appendChild(elink)
        //   elink.click()
        //   URL.revokeObjectURL(elink.href) // 释放URL 对象
        //   document.body.removeChild(elink)
        // } else { // IE10+下载
        //   navigator.msSaveBlob(blob, fileName)
        // }
      })
      // this.$refs.tables.exportCsv({
      //   filename: `table-${(new Date()).valueOf()}.csv`
      // })
    },
    saveEdit (params) {
      console.log(params, '保存编辑')
      // params.row.name = params.column.name
    },
    // 图片管理
    handleView (name) {
      // this.imgName = name
      this.visible = true
    },
    handleRemove (file) {
      console.log('删除')
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    // 上传img 返回 res
    uploadImgSuccess (res, file) {
      console.log('图片上传 callback', res.vo)
      this.curStoreImg = res.vo
      this.uploadList[0] = {
        status: 'finished',
        url: res.vo
      }
      this.$forceUpdate()
    },
    importStroeSuccess (res, file) {
      console.log('导入 场馆', res, file)
      this.init()
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
    },
    _getCityList (data) {
      getCityList(data).then(res => {
        this.cityList = res.pageList.list
      })
    }
  },
  mounted () {
    this.init('city')
  }
}
</script>

<style lang="less">
@import '../../assets/style/uploadImg.less';
</style>
