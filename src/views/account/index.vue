<template>
  <div>
    <div class="avatar-container">
      <div class="text">
        设置头像
      </div>
      <div style="margin-top: 10px;margin-bottom: 10px" class="text">
        选择一张个人正面照片作为头像，企业成员可以更容易认识你
      </div>
      <el-avatar style="margin-top: 10px;margin-bottom: 10px" :size="150" :src="imageUrl" />

      <div>
        <el-button style="width: 150px" type="primary" icon="el-icon-upload" @click="imagecropperShow=true">
          修改头像
        </el-button>
        <span style="color: #c6bec9;margin-left: 10px;font-size: 14px">
          仅支持JPG,PNG格式上传
        </span>
      </div>

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

    <div class="profile-container">
      <div class="text" style="margin-bottom: 20px">
        个人资料
      </div>
      <div style="width: 500px">
        <el-form
          ref="profile"
          :model="profile"
          label-width="100px"
          :rules="profileRules"
        >
          <el-form-item label="用户名" prop="name">
            <el-popover
              placement="top-start"
              width="310"
              trigger="hover"
              content="为了使您在工作中方便沟通，建议使用姓名"
            >
              <el-input slot="reference" v-model="profile.name" />
            </el-popover>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="profile.email" :disabled="true" />
          </el-form-item>
          <el-form-item label="出生日期">
            <el-date-picker
              v-model="profile.birthday"
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="profile.sex">
              <el-radio label="0">男</el-radio>
              <el-radio label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="个性签名">
            <el-input v-model="profile.desc" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="saveSetting">保存设置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="other-container">
      <div class="other-item">
        <div class="other-item-title">
          修改密码
          <el-link v-if="!editPasswordShow" style="font-size: 16px;float: right;margin-right: 30px" type="primary" @click="editPasswordShow=!editPasswordShow">
            展开
            <i class="el-icon-caret-bottom" />
          </el-link>
          <el-link v-else style="font-size: 16px;float: right;margin-right: 30px" type="primary" @click="editPasswordShow=!editPasswordShow">
            收起
            <i class="el-icon-caret-top" />
          </el-link>
        </div>
        <div class="other-item-body">
          修改密码时需要输入当前密码，如果你忘记了当前密码，可以点击这里
          <el-link style="font-size: 16px" type="primary" @click="toForgot">通过邮件重置</el-link>
          你的密码。
        </div>
        <el-form
          v-if="editPasswordShow"
          ref="editPassword"
          style="margin-top: 20px"
          :model="editPassword"
          :rules="editPasswordRules"
        >
          <el-form-item prop="oldPassword">
            <el-input
              v-model="editPassword.oldPassword"
              class="other-input"
              placeholder="旧密码"
              show-password
            />
          </el-form-item>
          <el-form-item prop="newPassword">
            <el-input
              v-model="editPassword.newPassword"
              class="other-input"
              placeholder="新密码"
              show-password
            />
          </el-form-item>
          <el-button
            class="btn-save"
            :loading="editPwdloading"
            type="primary"
            @click="savePassword"
          >保存</el-button>
        </el-form>
      </div>
      <div class="other-item">
        <div class="other-item-title">
          修改邮箱
          <el-link v-if="!editEmailShow" style="font-size: 16px;float: right;margin-right: 30px" type="primary" @click="editEmailShow=!editEmailShow">
            展开
            <i class="el-icon-caret-bottom" />
          </el-link>
          <el-link v-else style="font-size: 16px;float: right;margin-right: 30px" type="primary" @click="editEmailShow=!editEmailShow">
            收起
            <i class="el-icon-caret-top" />
          </el-link>
        </div>
        <div class="other-item-body">
          你当前的邮箱是
          <span style="color: #ff7575">{{ userInfo && userInfo.email }}</span>
          ，修改邮箱时系统会发送验证码到新的邮箱上，然后输入验证码后完成修改。
        </div>
        <el-form
          v-if="editEmailShow"
          ref="editEmail"
          :model="editEmail"
          :rules="editEmailRules"
          style="margin-top: 20px"
        >
          <el-form-item prop="email">
            <el-input
              v-model="editEmail.email"
              class="other-input"
              placeholder="请输入邮箱"
            />
          </el-form-item>
          <el-form-item prop="code">
            <el-input
              v-model="editEmail.code"
              class="other-input"
              placeholder="请输入验证码"
            >
              <template>
                <el-button
                  v-if="canSend"
                  slot="append"
                  class="btn-code"
                  @click.native.prevent="sendCode"
                >获取验证码</el-button>
                <template v-else slot="append">已发送，{{ timeLeft }}秒后重新获取</template>
              </template>
            </el-input>
          </el-form-item>
          <el-button
            :loading="editEmailLoading"
            class="btn-save"
            type="primary"
            @click.native.prevent="handleBind"
          >绑定</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import ImageCropper from '@/components/ImageCropper'
import { mapGetters } from 'vuex'
import { editUserInfo, sendVerifyCode, editPassword, editEmail } from '@/api/user'
import { Notification } from 'element-ui'

export default {
  name: 'Account',
  components: { ImageCropper },
  data() {
    const validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    // 检查密码是否包含数字和字母，且不少于8位
    const pwdValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('密码不能为空'))
      } else if (!pwdValid.test(value)) {
        callback(new Error('密码必须由数字和字母组合，且不能少于8位'))
      } else {
        callback()
      }
    }
    const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+$/
    const validateEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入邮箱'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的邮箱格式'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入验证码'))
      } else if (value.length !== 6) {
        callback(new Error('请输入6位数验证码'))
      } else {
        callback()
      }
    }
    const validateOldPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    return {
      editPasswordShow: false,
      editEmailShow: false,
      imagecropperShow: false,
      imagecropperKey: 0,
      loading: false,
      editPwdloading: false,
      editEmailLoading: false,
      canSend: true,
      timeLeft: 60,
      profile: {
        name: '',
        email: '',
        birthday: '',
        sex: '',
        desc: ''
      },
      profileRules: {
        name: [
          { required: true, trigger: 'blur', validator: validateName }
        ]
      },
      editPassword: {
        oldPassword: '',
        newPassword: ''
      },
      editPasswordRules: {
        oldPassword: [
          { required: true, trigger: 'blur', validator: validateOldPassword }
        ],
        newPassword: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      editEmail: {
        email: '',
        code: ''
      },
      editEmailRules: {
        email: [
          { required: true, trigger: 'blur', validator: validateEmail }
        ],
        code: [
          { required: true, trigger: 'blur', validator: validateCode }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    imageUrl() {
      return this.userInfo && this.userInfo.portrait
    }
  },
  created() {
    this.profile.name = this.userInfo.realName
    this.profile.email = this.userInfo.email
    this.profile.desc = this.userInfo.description
    this.profile.birthday = this.userInfo.birthDate
    this.profile.sex = this.userInfo.sex
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
    },
    toForgot() {
      window.open('#/forgot')
    },
    saveSetting() {
      this.$refs.profile.validate(async(valid) => {
        if (valid) {
          this.loading = true
          const requestData = {
            id: this.userInfo.userid
          }
          if (this.profile.name !== this.userInfo.realName) {
            requestData.realName = this.profile.name
          }
          if (this.profile.birthday !== this.userInfo.birthDate) {
            requestData.birthDate = this.profile.birthday
          }
          if (this.profile.sex !== this.userInfo.sex) {
            requestData.sex = this.profile.sex
          }
          if (this.profile.desc !== this.userInfo.description) {
            requestData.description = this.profile.desc
          }
          if (Object.keys(requestData).length !== 1) {
            let success
            await editUserInfo(requestData)
              .then(response => {
                success = response.success
              }).catch(() => {
                success = false
                this.loading = false
              })
            // 请求成功success为true，失败data为false
            if (success) {
              this.userInfo.realName = this.profile.name
              this.userInfo.birthDate = this.profile.birthday
              this.userInfo.sex = this.profile.sex
              this.userInfo.description = this.profile.desc
            } else {
              this.loading = false
            }
          } else {
            console.log('数据没有被修改')
          }
          Notification({
            type: 'success',
            title: '更新个人资料成功',
            duration: 3000
          })
          this.loading = false
        } else {
          this.loading = false
          console.log('error submit!!')
          return false
        }
      })
    },
    savePassword() {
      this.$refs.editPassword.validate(async(valid) => {
        if (valid) {
          this.editPwdloading = true
          let success
          await editPassword({
            id: this.userInfo.userid,
            oldPassword: this.editPassword.oldPassword,
            newPassword: this.editPassword.newPassword
          }).then(response => {
            success = response.success
          }).catch(() => {
            this.editPwdloading = false
            success = false
          })
          // 请求成功success为true
          if (success) {
            Notification({
              type: 'success',
              title: '更新密码成功',
              duration: 3000
            })
            // 清空页面上的数据
            this.editPassword = {
              oldPassword: '',
              newPassword: ''
            }
          }
          this.editPwdloading = false
        } else {
          this.editPwdloading = false
          console.log('error submit!!')
          return false
        }
      })
    },
    sendCode() {
      this.$refs.editEmail.validateField('email', (errorMessage) => {
        if (errorMessage) {
          return false
        } else {
          sendVerifyCode({
            email: this.editEmail.email,
            type: 'change-email'
          }) // 发送验证码
          this.canSend = false
          this.intervalId = setInterval(() => {
            this.timeLeft--
          }, 1000)
        }
      })
    },
    handleBind() {
      this.$refs.editEmail.validate(async(valid) => {
        if (valid) {
          this.editEmailLoading = true
          let success
          await editEmail(this.editEmail)
            .then(response => {
              success = response.success
            })
            .catch(() => {
              success = false
            })
          if (success) {
            // 更新vuex
            this.userInfo.email = this.editEmail.email
            Notification({
              type: 'success',
              title: '更新邮箱成功',
              duration: 3000
            })
            // 清空页面上的数据
            this.editEmail = {
              email: '',
              code: ''
            }
          }
          this.editEmailLoading = false
        } else {
          this.editEmailLoading = false
          console.log('error submit!!')
          return false
        }
      })
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
.profile-container {
  margin: 40px 40px 20px;
  border-bottom: 1px solid #eaeff1;
}
.other-container {
  margin: 20px 40px 40px;
}
.other-item {
  border-bottom: 1px solid #eaeff1;
  padding-bottom: 15px;
}
.other-item-title {
  margin: 10px 0;
  font-weight: 700;
  color: #4e545f;
}
.other-item-body {
  color: #b5bec9;
}
.text {
  font-size: 14px;
  color: #333333;
}
.other-input {
  width: 500px;
}
.btn-save {
  width: 100px;
}
.btn-code {
  background-color: #409eff !important;
  color: #fff !important;
}.btn-code:hover {
  background-color: #66b1ff !important;
}

</style>

