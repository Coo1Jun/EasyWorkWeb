<template>
  <div class="container">
    <!-- 进度条 -->
    <plan-navbar :progress="progress" class="plan-navbar" />
    <div class="plan-container">
      <!-- 左边的计划栏 -->
      <div class="sidebar">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
      </div>
      <!-- 右边的卡片内容 -->
      <div class="content">
        <!-- plan-avatar 所有人完成情况 -->
        <div v-if="planAvatarShow" class="plan-avatar">
          <div class="plan-avatar-average">
            <div>{{ averageTasks }}</div>
            <div style="color: #909399;width:80px;text-align:center">人均卡片</div>
          </div>
          <div v-horizontal-scroll class="plan-completed">
            <el-menu default-active="all" mode="horizontal" :style="{width:userCount*100 + 100 + 'px'}" @select="handleSelect">
              <el-menu-item index="all">
                <el-avatar
                  :size="'large'"
                  src="https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/el_default_user.png"
                />
                <div class="username">所有</div>
                <div>{{ allCompletedTasks }} / {{ allTaskCount }}</div>
              </el-menu-item>
              <el-tooltip
                v-for="user in planUsers"
                :key="user.id"
                :content="user.username"
                placement="bottom"
                effect="light"
                :visible-arrow="false"
                transition="none"
                :enterable="false"
              >
                <el-menu-item :index="user.id">
                  <el-avatar
                    :size="'large'"
                    src="https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/e540756cb72f4164b8647bae5bfb3f4d.png"
                  />
                  <div class="username">{{ user.username }}</div>
                  <div>{{ user.completedTasks }} / {{ user.taskCount }}</div>
                </el-menu-item>
              </el-tooltip>
            </el-menu>
          </div>
          <div class="plan-task-summary">
            <div>
              <div>{{ 14 }}天</div>
              <div style="color: #909399;width:80px;">剩余时间</div>
            </div>
            <div>
              <div>{{ remainingTasks }}</div>
              <div style="color: #909399;width:80px;">剩余卡片</div>
            </div>
            <div>
              <div>{{ 0 }}</div>
              <div style="color: #909399;width:80px;">延期卡片</div>
            </div>
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
      planUsers: [
        {
          id: '1',
          username: '小明1',
          taskCount: 10, // 任务总数
          completedTasks: 4 // 已经完成的任务
        },
        {
          id: '2',
          username: '小明2',
          taskCount: 10, // 任务总数
          completedTasks: 0 // 已经完成的任务
        },
        {
          id: '3',
          username: '小明发射点发射点发顺丰的3',
          taskCount: 40, // 任务总数
          completedTasks: 32 // 已经完成的任务
        },
        {
          id: '4',
          username: '小明4',
          taskCount: 30, // 任务总数
          completedTasks: 10 // 已经完成的任务
        }
      ],
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
    },
    userCount() {
      return this.planUsers ? this.planUsers.length : 0
    },
    allTaskCount() {
      const count = this.planUsers ? this.planUsers.reduce((cur, user) => user.taskCount + cur, 0) : 0
      console.log(count)
      return count
    },
    allCompletedTasks() {
      return this.planUsers ? this.planUsers.reduce((cur, user) => user.completedTasks + cur, 0) : 0
    },
    averageTasks() {
      return parseFloat((this.allTaskCount / this.userCount).toFixed(1))
    },
    progress() {
      return Math.ceil(this.allCompletedTasks / this.allTaskCount * 100)
    },
    remainingTasks() {
      return this.allTaskCount - this.allCompletedTasks
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
  // overflow-y: hidden;
  align-items: center; /* 垂直居中 */
  // overflow-x: auto;
  width: 100%;
}
.plan-avatar-average {
  display: flex;
  flex-direction: column;
  align-items: center;
  // background-color: #ebebeb;
  // flex-wrap: nowrap;
  padding: 30px 10px;
}
.plan-completed {
  overflow-y: hidden;
  overflow-x: auto;
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
      margin: 15px 0;
    }
  }
}
.el-menu--horizontal>.el-menu-item {
  height: 120px;
  line-height: inherit;
  margin-bottom: 5px;
}
.plan-task-summary {
  float: right;
  display: flex;
  align-items: center;
  padding: 30px 5px;
  text-align:center;
  margin-left: auto;
}
</style>
