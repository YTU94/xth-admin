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
        <FormItem label="优惠类型">
          <Row>
            <Select v-model="curCouponType" style="width:200px">
              <Option v-for="(item, index) in DISCOUNT_TYPE" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
          </Row>
        </FormItem>
        <FormItem label="折扣" v-show="curCouponType === 'RATE'">
          <Row>
            <input class="form-input" v-model="rateContent" type="number"></input>
          </Row>
        </FormItem>
        <FormItem label="满" v-show="curCouponType === 'FULL_REDUCTION'">
          <Row>
            <input class="form-input" v-model="rateContentList[0]" type="number"></input>
            <span> 减 </span>
            <input class="form-input" v-model="rateContentList[1]" type="number"></input>
          </Row>
        </FormItem>
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

        <FormItem label="有效截止时间">
          <Row>
            <Col span="4">
              <DatePicker type="date" @on-change="changeDate" placeholder="Select date" style="width: 200px"></DatePicker>
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
import { getDate } from '@/libs/tools.js'

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
      curApplyType: '',
      applyList: '', // 城市或场馆列表
      storeTotal: 0,
      effectTime: '',
      showModal: false,
      rateContentList: [0, 0],
      rateContent: '', // 折扣内容
      formDynamic: {
        items: [
          {
            value: '',
            key: 'name',
            index: 1,
            status: 1,
            name: '名称'
          }
          // {
          //   value: '',
          //   key: 'content',
          //   index: 1,
          //   status: 1,
          //   name: '内容'
          // }
        ]
      },
      columns: [
        { title: '名称', key: 'name', sortable: true, editable: true },
        { title: '内容', key: 'content', editable: true },
        { title: '使用范围', key: 'applyScopeContent', editable: true },
        { title: '截止时间', key: 'effectTimeFormat', editable: true },
        { title: '类型', key: 'typeName', editable: true },
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
    changeDate (v, d) {
      const a = new Date(v)
      this.effectTime = a.getTime()
    },
    init () {
      this._getCouponList({ pageSize: this.pageSize, pageNunber: 1 })
    },
    // save
    save () {
      let data = {}
      data.name = this.formDynamic.items[0].value
      data.content = this.curCouponType === 'RATE' ? this.rateContent : `${this.rateContentList[0]}|${this.rateContentList[1]}`
      data[this.curApplyType] = this.curApply
      data.type = this.curCouponType || 'RATE' // FULL_REDUCTION RATE
      data.effectTime = this.effectTime
      this._createCoupon(JSON.stringify(data))
      this.formDynamic.items.forEach(e => {
        e.value = ''
      })
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
        this.curApplyType = 'applyCityId'
        getCityList({}).then(res => {
          this.applyList = res.pageList.list
        })
      } else if (value === 'STORE') {
        this.curApplyType = 'applyStoreId'
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
          e.effectTimeFormat = getDate(e.effectTime, 'year')
          e.typeName = e.type === 'RATE' ? '折扣' : '满减'
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
.form-input{
  display: inline-block;
  width: 100px;
  height: 32px;
  line-height: 1.5;
  padding: 4px 7px;
  font-size: 12px;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  color: #515a6e;
  background-color: #fff;
  background-image: none;
  position: relative;
}
</style>
