<template>
  <div class="container">
    <div>
      <img class="logo" src="../../assets/logo/logo.png">
      <img class="logo" src="../../assets/logo/ew_logo.png">
    </div>
    <div class="container-main">
      <Signin v-if="$route.name === 'Login'" />
      <Signup v-else-if="$route.name === 'Signup'" />
      <Forgot v-else-if="$route.name === 'Forgot'" />
    </div>
  </div>
</template>
<script>
import Signin from './components/signin'
import Signup from './components/signup'
import Forgot from './components/forgot'
export default {
  name: 'TopPage',
  components: {
    Signin,
    Signup,
    Forgot
  }
}
</script>
<style scoped>
.container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  flex-direction: column; /* 垂直排列 */
  height: 100vh; /* 设置高度为视口高度，使其铺满屏幕 */
}

.logo {
  height: 50px;
  margin: 10px;
}

.container-main {
  margin: 20px;
}
</style>
