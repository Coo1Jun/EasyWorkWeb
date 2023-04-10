<template>
  <!-- 新建文件对话框 -->
  <el-dialog
    title="新建文件"
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="550px"
    @close="handleDialogClose"
  >
    <el-form
      ref="addFileForm"
      class="add-file-form"
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
        @click="handleDialogSure('addFileForm')"
      >确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
// import * as fileApi from '@/api/fileApi'

export default {
  name: 'AddFileDialog',
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
		 * 新建文件对话框 | 对话框关闭的回调
		 * @description 关闭对话框，重置表单
		 */
    handleDialogClose() {
      this.$refs['addFileForm'].resetFields()
      this.visible = false
      this.callback('cancel')
    },
    /**
		 * 新建文件对话框 | 确定按钮点击事件
		 * @description 校验表单，校验通过后调用新建文件接口
		 * @param {string} formName 表单ref值
		 */
    handleDialogSure(formName) {
      this.sureBtnLoading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            extendName: this.extendName,
            filePath: this.filePath,
            fileName: this.form.fileName
          }
          // fileApi
          //   .createOfficeFile(data)
          //   .then((res) => {
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
