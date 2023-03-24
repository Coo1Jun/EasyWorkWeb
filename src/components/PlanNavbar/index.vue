<template>
  <div class="navbar">
    <div class="navbar-progress-item">
      <div class="progress">
        <el-progress :text-inside="true" :stroke-width="20" :percentage="progress" status="success" />
      </div>
      <el-button class="btn" type="primary" @click="newWorkItem">
        新建卡片
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlanNavbar',
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  beforeDestroy() {
    // 解绑事件
    this.$off('openDialog')
  },
  methods: {
    newWorkItem() {
      this.$emit('openDialog')
    }
  }
}
</script>

<style scoped>
.navbar {
  height: 40px;
  display: flex;
  align-items: center; /* 垂直居中 */
  background-color: #fff;
  border-top: 1px solid #e7eaee;
  border-bottom: 1px solid #e7eaee;
}
.navbar-progress-item {
  height: 100%;
  display: flex;
  align-items: center; /* 垂直居中 */
}
.progress {
  width: 800px;
  margin: 0 20px;
}
.btn {
  padding: 5px 15px;
  margin-left: 10px;
}
</style>
