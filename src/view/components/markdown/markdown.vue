<template>
  <div>
    <Card>
      <Button style="margin: 10px 0;" type="primary" @click="newArticle">新增文章</Button>
      <tables ref="tables"
        searchable
        search-place="top"
        v-model="tableData"
        @on-delete="deleteHandle"
        @on-update="updateHandle"
        :columns="columns"/>
        </br>
        <!-- page -->
      <Row type="flex" justify="end">
        <Col>
          <Page :total="articleTotal" :page-size="pageSize" @on-change="pageChange" show-total />
        </Col>
      </Row>
      <br>
      <Row type="flex" justify="end" v-show="showModal">
        <Col span="24">
          <span>标题：</span>
          <Input v-model="article.title" placeholder="Enter something..." clearable style="width: 200px" />
        </Col>
        <br>
        <br>
        <Col span="24">
          <span>作者：</span>
          <Input v-model="article.author" placeholder="Enter something..." clearable style="width: 200px" />
        </Col>
        <br>
        <br>
        <Col span="24">
          <span>图片：</span>
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
            <img :src="curArticleImg" v-if="visible && curArticleImg" style="width: 100%">
          </Modal>
        </Col>
        <br>
        <br>
        <Col span="24">
          <markdown-editor  v-model="article.content" :localCache="false"/>
        </Col>
        <Button style="margin: 10px 0;" type="default" @click="showModal = false">取消</Button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Button style="margin: 10px 0;" type="primary" @click="save">保存</Button>
      </Row>

    </Card>
    <!-- 新增 -->
  </div>
</template>

<script>
import Tables from '_c/tables'
import MarkdownEditor from '_c/markdown'
import { getArticleList, deleteArticle, createArticle, updateArticle } from '@/api/article'
export default {
  name: 'markdown_page',
  components: {
    Tables,
    MarkdownEditor
  },
  data () {
    return {
      pageSize: 5,
      // 图片
      curArticleImg: '',
      uploadList: [],
      defaultList: [],
      uploadImgData: {
        imgType: ''
      },
      visible: false,
      uploadImgIcon: false,

      articleTotal: 0,
      showModal: false,
      isEditing: false,
      article: {
        title: '',
        author: '',
        content: ''
      },
      columns: [
        { title: '名称', key: 'title', sortable: true, editable: true },
        { title: '发起人', key: 'authorId', editable: true },
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
      const data = {
        articleSo: {}
      }
      this._getArticleList(data)
    },

    save () {
      this.showModal = false
      const data = {
        isHot: '',
        slug: '',
        imgUrl: this.curArticleImg,
        title: this.article.title,
        content: this.article.content
      }
      this._createArticle(JSON.stringify(data))
    },
    // 改变页码
    pageChange (v) {
      this._getArticleList({ pageSize: this.pageSize, pageNumber: v })
    },
    // 上传img 返回 res
    uploadImgSuccess (res, file) {
      console.log('图片上传 callback', res.vo)
      this.curArticleImg = res.vo
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
    // 新增文章
    newArticle () {
      this.isEditing = false
      this.article.title = ''
      this.article.author = ''
      this.article.content = ''
      this.showModal = true
    },
    // 删除文章
    deleteHandle (params) {
      this._deleteArticle({ id: params.row.id })
    },
    // 更新文章
    updateHandle (params) {
      this.isEditing = true
      this.article = { title: params.row.title, author: params.row.author, content: params.row.content }
      this.showModal = true
    },
    /*
    * api func
    */
    _createArticle (data) {
      createArticle(data).then(res => {
        this.init()
      })
    },
    _updateArticle (data) {
      updateArticle(data).then(res => {
        console.log(res)
      })
    },
    _deleteArticle (params) {
      deleteArticle(params).then(res => {
        this.init()
      })
    },
    _getArticleList (data, merge) {
      getArticleList(data).then(res => {
        this.tableData = res.pageList.list
        this.articleTotal = res.pageList.count
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less">
@import '../../../assets/style/uploadImg.less';

</style>
