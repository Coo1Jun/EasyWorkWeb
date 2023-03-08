<template>
  <el-card class="box-card">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      auto-complete="on"
    >

      <div class="title">
        登录
      </div>
      <div class="text">邮箱</div>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          placeholder="请输入邮箱"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>
      <div class="text">登录密码</div>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          placeholder="请输入密码"
          show-password
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>
      <el-button
        :loading="loading"
        class="btn-signin"
        type="primary"
        @click.native.prevent="handleLogin"
      >登录</el-button>

      <span style="color: #aaaaaa;margin-right: 5px">或</span>
      <el-link style="font-size: 16px" type="primary" @click="toRegister">注册</el-link>
      <el-link style="font-size: 16px;float: right" type="primary">忘记密码？</el-link>
    </el-form>
  </el-card>
</template>
<script>

export default {
  name: 'Signin',
  data() {
    const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+$/
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入邮箱'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的邮箱格式'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      loading: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    toRegister() {
      this.$router.push({ path: '/dashboard' })
    }
  }
}
</script>
<style scoped>
.box-card {
  width: 500px;
  height: 400px;
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

.btn-signin {
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
  background-color: #1296db;
}
.btn-signin:hover {
  background-color: #66b1ff;
}
</style>
