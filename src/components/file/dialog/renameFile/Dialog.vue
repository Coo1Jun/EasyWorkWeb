<template>
  <!-- 重命名文件对话框 -->
  <el-dialog
    title="重命名文件"
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="550px"
    @open="handleDialogOpen"
    @close="handleDialogClose"
  >
    <el-form
      ref="renameFileForm"
      class="rename-file-form"
      :model="form"
      :rules="formRules"
      label-width="100px"
      label-position="top"
    >
      <el-form-item label="文件名称" prop="fileName">
        <el-input
          v-model="form.fileName"
          placeholder="请输入文件名称"
          type="textarea"
          autosize
          maxlength="255"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleDialogClose">取 消</el-button>
      <el-button
        type="primary"
        :loading="sureBtnLoading"
        @click="handleDialogSure('renameFileForm')"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import * as fileApi from '@/api/fileApi'

export default {
  name: 'RenameFileDialog',
  data() {
    return {
      visible: false, //  对话框是否可见
      form: {
        fileName: ''
      },
      formRules: {
        fileName: [
          { required: true, message: '请输入文件名称', trigger: 'blur' }
        ]
      },
      sureBtnLoading: false
    }
  },
  methods: {
    /**
		 * 重命名文件对话框 | 对话框打开的回调
		 * @description 表单项回显原本的文件名
		 */
    handleDialogOpen() {
      this.form.fileName = this.oldFileName
    },
    /**
		 * 重命名文件对话框 | 对话框关闭的回调
		 * @description 关闭对话框，重置表单
		 */
    handleDialogClose() {
      this.$refs['renameFileForm'].resetFields()
      this.visible = false
      this.callback('cancel')
    },
    /**
		 * 重命名文件对话框 | 确定按钮点击事件
		 * @description 校验表单，校验通过后调用重命名文件接口
		 * @param {string} formName 表单ref值
		 */
    handleDialogSure(formName) {
      this.sureBtnLoading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // fileApi
          //   .renameFile({
          //     userFileId: this.userFileId,
          //     fileName: this.form.fileName
          //   })
          //   .then((res) => {
          //     console.log(res)
          //     this.sureBtnLoading = false
          //     if (res.code === 200) {
          //       this.$refs[formName].resetFields()
          //       this.visible = false
          //       this.callback('confirm')
          //     }
          //   })
          //   .catch(() => {
          //     this.sureBtnLoading = false
          //   })
        } else {
          this.sureBtnLoading = false
          return false
        }
      })
    }
  }
}
</script>
