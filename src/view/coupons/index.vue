<template>
  <div>
    <Card>
      <Button style="margin: 10px 0;" type="primary" @click="showModal = true">新增</Button>
      <tables ref="tables"
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-delete="deleteHandle"
        @on-save-edit="saveEdit"/>
      <!-- page -->
      <Row type="flex" justify="end">
        <Col>
          <Page :total="storeTotal" :page-size="pageSize" @on-change="pageChange" show-total />
        </Col>
      </Row>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
      <!-- 编辑 -->

      <edit-dialog :showModal="showModal" :formDynamic="formDynamic" @save="save" @cancel="cancel">
        <FormItem label="适用范围类型">
          <Row>
            <Select v-model="curCouponApplyType" @on-change="selectApplyType" style="width:200px">
              <Option v-for="(item, index) in COUPON_APPLY_SCOPE" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
          </Row>
        </FormItem>
        <FormItem label="适用范围内容">
          <Row>
            <Select v-model="curApply" filterable style="width:200px">
              <Option v-if="applyList && applyList.length > 0" v-for="(item, index) in applyList" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
          </Row>
        </FormItem>
        <FormItem label="优惠类型">
          <Row>
            <Select v-model="curCouponType" style="width:200px">
              <Option v-for="(item, index) in DISCOUNT_TYPE" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
          </Row>

        </FormItem>
        <FormItem label="有效截止时间">
          <Row>
            <Col span="4">
              <DatePicker type="date" :value="effectTime" placeholder="Select date" style="width: 200px"></DatePicker>
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
import { getCouponList, createCoupon, deleteCoupon, updateCoupon } from '@/api/coupon'
import { uploadImg } from '@/api/common'
import { getStoreList } from '@/api/vuene'
import { getCityList } from '@/api/city'

const COUPON_APPLY_SCOPE = [ // eslint-disable-line
  { label: '城市', value: 'CITY' },
  { label: '场馆', value: 'STORE' }
]
const DISCOUNT_TYPE = [ // eslint-disable-line
  { label: '满减', value: 'FULL_REDUCTION' },
  { label: '折扣', value: 'RATE' }
]
export default {
  name: 'tables_page',
  components: {
    Tables,
    EditDialog
  },
  data () {
    return {
      pageSize: 5,
      COUPON_APPLY_SCOPE: COUPON_APPLY_SCOPE,
      DISCOUNT_TYPE: DISCOUNT_TYPE,
      curCouponType: '',
      curCouponApplyType: '',
      curApply: '', // 选择的城市或场馆
      applyList: '', // 城市或场馆列表
      storeTotal: 0,
      effectTime: '',
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
            key: 'content',
            index: 1,
            status: 1,
            name: '内容'
          }
        ]
      },
      columns: [
        { title: '名称', key: 'name', sortable: true, editable: true },
        { title: '内容', key: 'content', editable: true },
        { title: '使用范围', key: 'applyScopeContent', editable: true },
        { title: '截止时间', key: 'effectTime', editable: true },
        { title: '类型', key: 'type', editable: true },
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
      this._getCouponList({ pageSize: this.pageSize, pageNunber: 1 })
    },
    // save
    save () {
      let data = {}
      this.formDynamic.items.forEach(e => {
        data[e.key] = e.value
      })
      debugger
      if (typeof (this.formDynamic.items[1].value) !== 'number') {
        this.$Message.error('内容需为数字')
        return
      }
      data.applyCityId = 1
      data.type = this.curCouponType || 'RATE' // FULL_REDUCTION RATE
      data.effectTime = this.effectTime
      this._createCoupon(JSON.stringify(data))
    },
    // 关闭dialog
    cancel () {
      this.showModal = false
    },
    // 改变页码
    pageChange (v) {
      this._getCouponList({ pageSize: this.pageSize, pageNumber: v })
    },
    selectApplyType (value) {
      this.applyList = []
      this.curApply = ''
      if (value === 'CITY') {
        getCityList({}).then(res => {
          this.applyList = res.pageList.list
        })
      } else if (value === 'STORE') {
        getStoreList({}).then(res => {
          this.applyList = res.pageList.list
        })
      } else {
        return false
      }
      console.log(value, this.applyList)
      this.$forceUpdate()
    },
    deleteHandle (params) {
      this._deleteCoupon({ id: params.row.id })
    },
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
    /*
    * api func
    */
    _createCoupon (data) {
      createCoupon(data).then(res => {
        this.init()
        this.showModal = false
      })
    },
    _updateCoupon (data) {
      updateCoupon(data).then(res => {
        console.log(res)
      })
    },
    _deleteCoupon (params) {
      // params.tableData.filter((item, index) => index !== params.row.initRowIndex)
      deleteCoupon(params).then(res => {
        this.init()
      })
    },
    _getCouponList (data, merge) {
      getCouponList(data).then(res => {
        res.pageList.list.forEach(e => {
          if (e.contentList && e.contentList.length > 0) {
            e.content = `满${e.contentList[0]}减${e.contentList[1]}元`
          }
        })
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

</style>
