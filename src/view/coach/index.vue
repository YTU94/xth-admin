<template>
  <div>
    <Card>
      <Button style="margin: 10px 0;" type="primary" @click="showModal = true">新增</Button>
      <Upload
        style="display: inline-block;margin-left:20px;"
        :show-upload-list="Boolean(false)"
        :on-success="importCoachSuccess"
        :format="['jpg','jpeg','png', 'xlsx']"
        action="http://47.92.217.9:9091/rest/coach/import">
        <Button icon="ios-cloud-upload-outline">模板导入</Button>
      </Upload>
      <tables ref="tables"
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-selection-change="selectChange"
        @on-delete="_deleteCoach"
        @on-save-edit="saveEdit"/>
      <!-- page -->
      <Row type="flex" justify="end">
        <Col>
          <Page :total="storeTotal" :page-size="pageSize" @on-change="pageChange" show-total />
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
import { getCoachList, createCoach, deleteCoach, updateCoach, exportCoach } from '@/api/coach'
import { getStoreList } from '@/api/vuene'

export default {
  name: 'tables_page',
  components: {
    Tables,
    EditDialog
  },
  data () {
    return {
      pageSize: 5,
      // 图片
      curCoachImg: '',
      uploadList: [],
      defaultList: [],
      uploadImgData: {
        imgType: ''
      },
      visible: false,
      uploadImgIcon: false,

      selectCoachIdList: '',
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
        {
          type: 'selection',
          key: 'handle',
          width: 60,
          align: 'center'
        },
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
      this._getCoachList({ pageSize: this.pageSize, pageNumber: '1' })
      this._getAllStoreList({})
    },
    save () {
      const data = {}
      this.formDynamic.items.forEach(e => {
        data[e.key] = e.value
      })
      data.imgUrl = this.curCoachImg
      data.storeId = this.curStoreId
      this._createCoach(data)
    },
    importCoachSuccess (res, file) {
      this.init()
    },
    // 改变页码
    pageChange (v) {
      this._getCoachList({ pageSize: this.pageSize, pageNumber: v })
    },
    // 上传img 返回 res
    uploadImgSuccess (res, file) {
      console.log('图片上传 callback', res.vo)
      this.curCoachImg = res.vo
      this.uploadList[0] = {
        status: 'finished',
        url: res.vo
      }
      this.$forceUpdate()
    },
    handleView (name) {
      // this.imgName = name
      this.visible = true
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
    // table select change 表格勾选
    selectChange (selection) {
      this.selectCoachIdList = selection.map(e => {
        return e.id
      })
    },
    exportExcel () {
      if (this.selectCoachIdList.length < 1) {
        this.$Message.error('请选择要到处的教练')
        return false
      }
      exportCoach({ idList: this.selectCoachIdList }).then(res => {
        if (res.vo) {
          location.href = res.vo
        }
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
@import '../../assets/style/uploadImg.less';
</style>
