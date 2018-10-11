<template>
  <div>
    <Card>
      <Button style="margin: 10px 0;" type="primary" @click="showModal = true">新增文章</Button>
      <tables ref="tables"
        editable
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"/>
    </Card>
    <markdown-editor v-model="content"/>
  </div>
</template>

<script>
import Tables from '_c/tables'
import MarkdownEditor from '_c/markdown'
import { getArticleList } from '@/api/coach'
export default {
  name: 'markdown_page',
  components: {
    Tables,
    MarkdownEditor
  },
  data () {
    return {
      content: '',
      columns: [
        { title: '名称', key: 'name', sortable: true, editable: true },
        { title: '发起人', key: 'contactName', editable: true },
        // { title: '联系人', key: 'contactName', editable: true },
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
    init () {
      const data = {
        articleSo: {}
      }
      this._getArticleList(data)
    },
    /*
    * api func
    */
    _getArticleList (data) {
      getArticleList(data).then(res => {
        console.log(res)
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
