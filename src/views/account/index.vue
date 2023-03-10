<template>
  <div>
    <div class="avatar-container">
      <div class="text">
        设置头像
      </div>
      <div style="margin-top: 10px;margin-bottom: 10px" class="text">
        选择一张个人正面照片作为头像，企业成员可以更容易认识你
      </div>
      <el-avatar style="margin-right: 10px" :size="150" :src="imageUrl" />

      <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">
        修改头像
      </el-button>
      <span style="color: #c6bec9;margin-left: 10px;font-size: 14px">
        仅支持JPG,PNG格式上传
      </span>

      <image-cropper
        v-show="imagecropperShow"
        :key="imagecropperKey"
        :width="300"
        :height="300"
        url="/api/ew-server/file/upload"
        lang-type="zh"
        @close="close"
        @crop-upload-success="cropSuccess"
      />
    </div>
    <div>
      hello
    </div>
  </div>
</template>

<script>
import ImageCropper from '@/components/ImageCropper'
import { mapGetters } from 'vuex'
import { editUserInfo } from '@/api/user'

export default {
  name: 'Account',
  components: { ImageCropper },
  data() {
    return {
      imagecropperShow: false,
      imagecropperKey: 0
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    imageUrl() {
      return this.userInfo.portrait
    }
  },
  methods: {
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.userInfo.portrait = resData.location
      editUserInfo({
        id: this.userInfo.userid,
        portrait: resData.id
      })
    },
    close() {
      this.imagecropperShow = false
    }
  }
}
</script>

<style scoped>
.avatar-container {
  margin: 40px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eaeff1;
}
.text {
  font-size: 14px;
  color: #333333;
}
</style>

