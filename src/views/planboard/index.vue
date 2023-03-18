<template>
  <div class="container">
    <!-- 进度条 -->
    <plan-navbar :progress="50" class="plan-navbar" />
    <div class="plan-container">
      <!-- 左边的计划栏 -->
      <div class="sidebar">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
      </div>
      <!-- 右边的卡片内容 -->
      <div class="content">
        <!-- plan-avatar 所有人完成情况 -->
        <div v-if="planAvatarShow" v-horizontal-scroll class="plan-avatar">
          <div class="plan-avatar-average">
            <div>4.6</div>
            <div style="color: #909399;width:40px;text-align:center">人均</div>
          </div>
          <div>
            <el-menu :default-active="activeIndex" mode="horizontal" :style="{width:12*100 + 'px'}" @select="handleSelect">
              <el-menu-item v-for="i in 12" :key="i" :index="i">
                <el-avatar
                  :size="'large'"
                  src="https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/e540756cb72f4164b8647bae5bfb3f4d.png"
                />
                <div class="username">李正帆</div>
              </el-menu-item>
            </el-menu>
          </div>
        </div>
        <div class="plan-avatar-btn">
          <button v-if="planAvatarShow" @click="planAvatarShow = !planAvatarShow"><i class="el-icon-arrow-up" /></button>
          <button v-if="!planAvatarShow" @click="planAvatarShow = !planAvatarShow"><i class="el-icon-arrow-down" /></button>
        </div>
        <div class="plan-content">
          plan-content
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import PlanNavbar from '@/components/PlanNavbar'
import Vue from 'vue'
// 鼠标滚轮控制横向滚动条
Vue.directive('horizontal-scroll', {
  inserted: function(el) {
    el.addEventListener('wheel', function(event) {
      if (event.deltaY !== 0) {
        event.preventDefault()
        el.scrollLeft += event.deltaY
      }
    })
  }
})

export default {
  name: 'Planboard',
  components: { PlanNavbar },
  data() {
    return {
      planAvatarShow: true, // 完成情况卡片的展示
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    haveTagsView() {
      // TagsView高 34px
      return this.$store.state.settings.tagsView
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style scoped lang="scss">
.container{
  padding-bottom: 40px;
}

.plan-container {
  width: 100%;
  display: flex
}
.sidebar {
  width: 16%;
}
.content {
  width: 84%;
}
.plan-avatar {
  background-color: #f6f8fa;
  display: flex;
  overflow-y: hidden;
  align-items: center; /* 垂直居中 */
  overflow-x: auto;
  width: 100%;
}
.plan-avatar-average {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  background-color: #ebebeb;
  // flex-wrap: nowrap;
  padding: 30px;
}
.plan-avatar-btn {
  padding: 0 50%;
  button {
    border: none;
    background-color: #f6f8fa;
  }
}
.el-menu {
  background-color: #f6f8fa;
  // width: 3000px;
  border: none;
  .el-menu-item{
    // width: 100px;
    // overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .username{
      width: 60px;
      text-align: center;
      white-space: nowrap; /* 禁止文本换行 */
      overflow: hidden; /* 隐藏溢出的文本 */
      text-overflow: ellipsis; /* 显示省略号 */
    }
  }
}
.el-menu--horizontal>.el-menu-item {
  height: 100px;
  line-height: inherit;
}
</style>
