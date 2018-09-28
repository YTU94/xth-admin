<template>
  <div class="edit-dialog">
    <h1>sadsad</h1>
  <Modal
          v-model="modal1"
          title="Common Modal dialog box title"
          @on-ok="ok"
          @on-cancel="cancel">
          <p>Content of dialog</p>
          <p>Content of dialog</p>
          <p>Content of dialog</p>
      </Modal>
  </div>
</template>

<script>
export default {
  name: 'editDialog',
  props: {
    value: [String, Number],
    edittingCellId: String,
    params: Object,
    editable: Boolean
  },
  data () {
    return {
      modal1: true
    }
  },
  computed: {
    isEditting () {
      return this.edittingCellId === `editting-${this.params.index}-${this.params.column.key}`
    }
  },
  methods: {
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
    }
  }
}
</script>

<style lang="less">

</style>
