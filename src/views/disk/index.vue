<template>
  <div class="file-wrapper" @dragenter="showUploadMask">
    <el-container class="el-container">
      <el-container>
        <el-main class="el-main">
          <FileList />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import FileList from '@/components/file/FileList.vue'

export default {
  name: 'Disk',
  components: {
    FileList
  },
  methods: {
    // 显示拖拽上传文件遮罩
    showUploadMask(e) {
      e.stopPropagation()
      e.preventDefault()
      this.$store.commit('showUploadMask')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';
@import '~_a/styles/mixins.styl';

.file-wrapper {
  width: 100% !important;
}

.el-container {
  .el-aside {
    height: calc(100vh - 66px);
    overflow: hidden;
  }
}

.el-main {
  padding: 0 16px !important;
  overflow: hidden;
}
</style>
