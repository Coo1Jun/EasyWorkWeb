<template>
  <!-- 删除文件对话框 -->
  <el-dialog
    title="删除文件"
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="550px"
    @close="handleDialogClose"
  >
    <!-- <div v-if="deleteMode === 1">删除后可在回收站查看, 是否继续删除？</div> -->
    <!-- <div v-else-if="deleteMode === 2">此操作将永久删除该文件, 是否继续？</div> -->
    <div>此操作将永久删除该文件, 是否继续？</div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleDialogClose">取 消</el-button>
      <el-button
        type="primary"
        :loading="sureBtnLoading"
        @click="handleDialogSure"
      >确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { deleteFileApi } from '@/api/netdisk'

export default {
  name: 'DeleteFileDialog',
  data() {
    return {
      visible: false, //  对话框是否可见
      sureBtnLoading: false
    }
  },
  methods: {
    /**
     * 删除文件对话框 | 对话框关闭的回调
     * @description 关闭对话框，重置表单
     */
    handleDialogClose() {
      this.visible = false
      this.callback('cancel')
    },
    /**
     * 删除文件对话框 | 确定按钮点击事件
     * @description 区分 删除到回收站中 | 在回收站中彻底删除，调用相应的删除文件接口
     */
    async handleDialogSure() {
      this.sureBtnLoading = true
      console.log(this.fileInfo)
      deleteFileApi(this.fileInfo.id).then(res => {
        if (res.success) {
          this.visible = false
          this.sureBtnLoading = false
          this.callback('confirm')
          this.$message.success('删除成功')
        }
      }).catch(() => {
        this.sureBtnLoading = false
      })
      // let res = null
      // // 批量删除模式
      // if (this.isBatchOperation) {
      //   // 区分删除类型
      //   switch (this.deleteMode) {
      //     // 删除文件到回收站
      //     case 1: {
      //       const data = {
      //         userFileIds: this.fileInfo
      //           .map((item) => item.userFileId)
      //           .join(',')
      //       }
      //       // res = await fileApi.deleteFile(data)
      //       break
      //     }
      //     // 回收站中彻底删除
      //     case 2: {
      //       const data = {
      //         userFileIds: this.fileInfo
      //           .map((item) => item.userFileId)
      //           .join(',')
      //       }
      //       // res = await recoveryFileApi.deleteRecoveryFile(data)
      //       break
      //     }
      //   }
      // } else {
      //   // 单文件删除模式
      //   // 区分删除类型
      //   switch (this.deleteMode) {
      //     // 删除文件到回收站
      //     case 1: {
      //       const data = {
      //         userFileIds: this.fileInfo.userFileId
      //       }
      //       // res = await fileApi.deleteFile(data)
      //       break
      //     }
      //     // 回收站中彻底删除
      //     case 2: {
      //       const data = {
      //         userFileIds: this.fileInfo.userFileId
      //       }
      //       // res = await recoveryFileApi.deleteRecoveryFile(data)
      //       break
      //     }
      //   }
      // }
      // if (res.code === 200 || res.success) {
      //   console.log(res)
      //   this.visible = false
      //   this.callback('confirm')
      //   this.$message.success('删除成功')
      // }
    }
  }
}
</script>
