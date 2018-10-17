<template>
    <Modal
      v-model="showModal"
      :title="title"
      :footer-hide="Boolean(false)"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form ref="formDynamic" :model="formDynamic" :label-width="120" style="width: 350px">
        <FormItem
            v-for="(item, index) in formDynamic.items"
            v-if="item.status"
            :key="index"
            :label="item.name"
            :prop="'items.' + index + '.value'"
            :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
          <Row>
            <Col span="24">
              <Input type="text" v-model="item.value" placeholder="Enter something..."></Input>
            </Col>
          </Row>
        </FormItem>
        <slot></slot>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formDynamic')">保存</Button>
            <!-- <Button @click="handleReset('formDynamic')" style="margin-left: 8px">Reset</Button> -->
        </FormItem>
      </Form>
    </Modal>
</template>

<script>
export default {
  name: 'editDialog',
  props: {
    title: String,
    showModal: [Boolean, String, Number],
    // value: [String, Number],
    edittingCellId: String,
    params: Object,
    editable: Boolean,
    formDynamic: Object
  },
  data () {
    return {
      index: 1
    }
  },
  computed: {
    dsiabled () {
      return false
      // this.$refs.formDynamic.validate((valid) => {
      //   if (valid) {
      //     return false
      //   } else {
      //     return true
      //   }
      // })
    },
    isEditting () {
      return this.edittingCellId === `editting-${this.params.index}-${this.params.column.key}`
    }
  },
  methods: {
    ok () {
      this.$refs.formDynamic.validate((valid) => {
        if (valid) {
          this.$emit('save', this.formDynamic)
        } else {
          this.$Message.error('Fail!')
          return false
        }
      })
    },
    cancel () {
      this.$emit('cancel', this.formDynamic)
    },

    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!')
          this.$emit('save', this.formDynamic)
        } else {
          this.$Message.error('Fail!')
        }
      })
    }
  }
}
</script>

<style lang="less">

</style>
