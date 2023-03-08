<template>
  <el-card class="box-card">
    <el-form
      ref="forgotForm"
      :model="forgotForm"
      :rules="registerRules"
      auto-complete="on"
    >
      <div class="title">
        找回密码
      </div>
      <div class="text">邮箱</div>
      <el-form-item prop="email">
        <el-input
          v-model="forgotForm.email"
          placeholder="请输入邮箱"
          auto-complete="on"
          @keyup.enter.native="handleForgot"
        />
      </el-form-item>
      <div class="text">验证码</div>
      <el-form-item prop="code">
        <el-input
          v-model="forgotForm.code"
          placeholder="请输入验证码"
          auto-complete="on"
          @keyup.enter.native="handleForgot"
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
      <div class="text">请输入新密码</div>
      <el-form-item prop="password">
        <el-input
          v-model="forgotForm.password"
          placeholder="请输入密码"
          show-password
          @keyup.enter.native="handleForgot"
        />
      </el-form-item>
      <div class="text">再次确认密码</div>
      <el-form-item prop="confirmPwd">
        <el-input
          v-model="forgotForm.confirmPwd"
          placeholder="再次确认密码"
          show-password
          @keyup.enter.native="handleForgot"
        />
      </el-form-item>
      <el-button
        :loading="loading"
        class="btn-signup"
        type="primary"
        @click.native.prevent="handleForgot"
      >重置</el-button>

      <el-link style="font-size: 16px" type="primary" @click="toLogin">返回登录</el-link>
    </el-form>
  </el-card>
</template>
<script>
import { sendVerifyCode, forgot } from '@/api/user'
import { Message } from 'element-ui'
export default {
  name: 'Forgot',
  data() {
    const emailValid = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+$/
    const validateEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入邮箱'))
      } else if (!emailValid.test(value)) {
        callback(new Error('请输入正确的邮箱格式'))
      } else {
        callback()
      }
    }
    // 检查密码是否包含数字和字母
    const pwdValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (!pwdValid.test(value)) {
        callback(new Error('密码必须由数字和字母组合，且不能少于8位'))
      } else {
        callback()
      }
    }
    const validateConfirmPwd = (rule, value, callback) => {
      if (value !== this.forgotForm.password) {
        callback(new Error('两次输入密码不一致'))
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
    return {
      forgotForm: {
        password: '',
        confirmPwd: '',
        email: '',
        code: ''
      },
      registerRules: {
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        confirmPwd: [
          { required: true, trigger: 'blur', validator: validateConfirmPwd }
        ],
        email: [
          { required: true, trigger: 'blur', validator: validateEmail }
        ],
        code: [
          { required: true, trigger: 'blur', validator: validateCode }
        ]
      },
      loading: false,
      canSend: true,
      timeLeft: 60,
      intervalId: null // 定时器 ID

    }
  },
  watch: {
    timeLeft() {
      if (this.timeLeft === 0) {
        this.canSend = true
        clearInterval(this.intervalId) // 清除定时器
        this.timeLeft = 60
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.intervalId) // 清除定时器
  },
  methods: {
    handleForgot() {
      this.$refs.forgotForm.validate(async(valid) => {
        if (valid) {
          this.loading = true
          const { data } = await forgot({
            password: this.forgotForm.password,
            email: this.forgotForm.email,
            code: this.forgotForm.code
          }).catch(() => {
            this.loading = false
          })
          if (data) {
            Message({
              message: '找回密码成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.$router.push({ path: '/login' })
          }
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    toLogin() {
      this.$router.push({ path: '/login' })
    },
    sendCode() {
      this.$refs.forgotForm.validateField('email', (errorMessage) => {
        if (errorMessage) {
          return false
        } else {
          sendVerifyCode({
            email: this.forgotForm.email,
            type: 'forgot'
          }) // 发送验证码
          this.canSend = false
          this.intervalId = setInterval(() => {
            this.timeLeft--
          }, 1000)
        }
      })
    }
  }
}
</script>
<style scoped>
.box-card {
  width: 500px;
  padding-left: 15px;
  padding-right: 15px;
}

.title {
  display: flex;
  justify-content: center; /* 水平居中 */
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
  margin-bottom: 20px;
  font-size: 20px;
}

.text {
  margin: 10px;
}

.btn-signup {
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
  background-color: #1296db;
}
.btn-signup:hover {
  background-color: #66b1ff;
}

.btn-code {
  background-color: #1296db !important;
  color: #fff !important;
}.btn-code:hover {
  background-color: #66b1ff !important;
}

</style>
