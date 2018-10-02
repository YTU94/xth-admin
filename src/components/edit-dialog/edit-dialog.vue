<template>
  <div class="edit-dialog">
    <h1>sadsad</h1>
    <Modal
      v-model="showModel"
      title="新增"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form ref="formDynamic" :model="formDynamic" :label-width="80" style="width: 300px">
        <FormItem
                v-for="(item, index) in formDynamic.items"
                v-if="item.status"
                :key="index"
                :label="'Item ' + item.name"
                :prop="'items.' + index + '.value'"
                :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
            <Row>
                <Col span="24">
                  <Input type="text" v-model="item.value" placeholder="Enter something..."></Input>
                </Col>
            </Row>
        </FormItem>
        <!-- <FormItem>
            <Button type="primary" @click="handleSubmit('formDynamic')">Submit</Button>
            <Button @click="handleReset('formDynamic')" style="margin-left: 8px">Reset</Button>
        </FormItem> -->
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'editDialog',
  props: {
    showModel: [Boolean],
    value: [String, Number],
    edittingCellId: String,
    params: Object,
    editable: Boolean
  },
  data () {
    return {
      modal1: false,
      index: 1,
      formDynamic: {
        items: [
          {
            value: '',
            index: 1,
            status: 1,
            name: 'name'
          }
        ]
      }
    }
  },
  computed: {
    isEditting () {
      return this.edittingCellId === `editting-${this.params.index}-${this.params.column.key}`
    }
  },
  methods: {
    ok () {
      this.$emit('')
    },
    cancel () {},
    handleInput (val) {
      this.$emit('input', val)
    },
    startEdit () {
      this.$emit('on-start-edit', this.params)
    },
    saveEdit () {
      this.$emit('on-save-edit', this.params)
    },
    canceltEdit () {
      this.$emit('on-cancel-edit', this.params)
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    handleAdd () {
      this.index++
      this.formDynamic.items.push({
        value: '',
        index: this.index,
        status: 1
      })
    },
    handleRemove (index) {
      this.formDynamic.items[index].status = 0
    }
  }
}
</script>

<style lang="less">

</style>
