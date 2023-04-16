import Vue from 'vue'

import 'normalize.css/normalize.css' // CSS重置的现代替代方案

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import '@wangeditor/editor/dist/css/style.css' // 富文本编辑器

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // 权限控制

// 引入文件操作函数
import file from '@/utils/file.js'
// 引入文件操作相关插件
import fileOperationPlugins from '@/utils/fileOperationPlugins.js'
// 全局样式
import '_a/styles/base.styl'
import '_a/styles/iconfont/iconfont.css'
import '_a/styles/iconfontCover.styl'
import '_a/styles/elementCover.styl'
import '_a/styles/mediaScreenXs.styl'
// 聊天组件
import LemonIMUI from 'lemon-imui'
import 'lemon-imui/dist/index.css'
Vue.use(LemonIMUI)

/**
 * 如果不想使用模拟服务器
 * 你希望将MockJs用于模拟api
 * 可以执行：mockXHR()
 *
 * 目前MockJ将用于生产环境，
 * 请在项目上线前删除它！
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// 设置 ElementUI 语言为英文 EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$file = file
for (const key in fileOperationPlugins) {
  Vue.prototype[`$${key}`] = fileOperationPlugins[key]
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
