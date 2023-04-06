<template>
  <el-card class="box-card">
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="registerRules"
      auto-complete="on"
    >

      <div class="title">
        注册
      </div>
      <div class="text">
        用户名
        <span style="font-size: 14px;color: #aaaaaa;margin-left: 5px">为了使您在工作中方便沟通，建议使用姓名</span>
      </div>
      <el-form-item prop="username">
        <el-input
          v-model="registerForm.username"
          placeholder="请输入用户名"
          auto-complete="on"
          maxlength="32"
          show-word-limit
          @keyup.enter.native="handleRegister"
        />
      </el-form-item>
      <div class="text">邮箱</div>
      <el-form-item prop="email">
        <el-input
          v-model="registerForm.email"
          placeholder="请输入邮箱"
          auto-complete="on"
          @keyup.enter.native="handleRegister"
        />
      </el-form-item>
      <div class="text">验证码</div>
      <el-form-item prop="code">
        <el-input
          v-model="registerForm.code"
          placeholder="请输入验证码"
          auto-complete="on"
          @keyup.enter.native="handleRegister"
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
      <div class="text">密码</div>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          placeholder="请输入密码"
          show-password
          @keyup.enter.native="handleRegister"
        />
      </el-form-item>
      <el-button
        :loading="loading"
        class="btn-signup"
        type="primary"
        @click.native.prevent="handleRegister"
      >注册</el-button>

      <span style="color: #aaaaaa;margin-right: 5px">或</span>
      <el-link style="font-size: 16px" type="primary" @click="toLogin">登录</el-link>
    </el-form>
  </el-card>
</template>
<script>
import { sendVerifyCode, register } from '@/api/user'
import { Message } from 'element-ui'
export default {
  name: 'Signup',
  data() {
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
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
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
      registerForm: {
        username: '',
        password: '',
        email: '',
        code: ''
      },
      registerRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
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
    handleRegister() {
      this.$refs.registerForm.validate(async(valid) => {
        if (valid) {
          this.loading = true
          let success
          await register({
            realName: this.registerForm.username,
            password: this.registerForm.password,
            email: this.registerForm.email,
            code: this.registerForm.code
          }).then(response => {
            success = response.success
          }).catch(() => {
            this.loading = false
            success = false
          })
          if (success) {
            Message({
              message: '注册成功',
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
      this.$refs.registerForm.validateField('email', (errorMessage) => {
        if (errorMessage) {
          return false
        } else {
          sendVerifyCode({
            email: this.registerForm.email,
            type: 'register'
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
