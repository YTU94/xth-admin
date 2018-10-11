<template>
  <div>
    <Card>
      <Button style="margin: 10px 0;" type="primary" @click="showModal = true">新增文章</Button>
      <tables ref="tables"
        editable
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
          <Page :total="articleTotal" show-total />
        </Col>
      </Row>
      <br>
      <Row type="flex" justify="end" v-show="showModal">
        <Col span="24">
          <span>标题：</span>
          <Input v-model="article.title" placeholder="Enter something..." clearable style="width: 200px" />
        </Col>
        <br>
        <Col span="24">
          <markdown-editor  v-model="article.content"/>
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
      articleTotal: 0,
      showModal: false,
      article: {
        title: '',
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
        title: this.article.title,
        content: this.article.content
      }
      this._createArticle(JSON.stringify(data))
    },
    // 删除文章
    deleteHandle (params) {
      this._deleteArticle({ id: params.row.id })
    },
    // 更新文章
    updateHandle (params) {},
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

<style>

</style>
