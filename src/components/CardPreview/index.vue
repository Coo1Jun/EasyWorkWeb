<template>
  <el-dialog
    :visible.sync="workItemVisible"
    width="90%"
    top="4vh"
    @closed="closeDialog"
  >
    <div>hello</div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CardPreview',
  props: {
    visable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      workItemVisible: false
    }
  },
  watch: {
    visable(newVal) {
      console.log(newVal)
      this.workItemVisible = newVal
    }
  },
  beforeDestroy() {
    // 解绑所有自定义事件
    this.$off()
  },
  methods: {
    closeDialog() {
      this.$emit('set-visable', false)
    }
  }
}
</script>

<style>

</style>
