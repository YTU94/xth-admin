<template>
    <Modal
      v-model="showModal"
      :title="title"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form ref="formDynamic" :model="formDynamic" :label-width="80" style="width: 300px">
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
        <!-- <FormItem>
            <Button type="primary" @click="handleSubmit('formDynamic')">Submit</Button>
            <Button @click="handleReset('formDynamic')" style="margin-left: 8px">Reset</Button>
        </FormItem> -->
      </Form>
    </Modal>
</template>

<script>
export default {
  name: 'editDialog',
  props: {
    title: String,
    showModal: [Boolean],
    value: [String, Number],
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
    isEditting () {
      return this.edittingCellId === `editting-${this.params.index}-${this.params.column.key}`
    }
  },
  methods: {
    ok () {
      this.$emit('save', this.formDynamic)
    },
    cancel () {
      this.$emit('cancel', this.formDynamic)
    },

    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!')
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
