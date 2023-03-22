<template>
  <div class="container">
    <div class="plan-container">
      <!-- 左边的计划栏 -->
      <div class="sidebar">
        <div class="navbar-plan-item">
          <el-button class="btn" type="primary" @click="addPlanVisible = true">
            新建计划
          </el-button>
        </div>
        <el-tree
          ref="planTree"
          :data="data"
          node-key="id"
          highlight-current
          :props="defaultProps"
          @node-click="handleNodeClick"
          @node-contextmenu="handleContextmenu"
        />
      </div>
      <!-- 右边的卡片内容 -->
      <div class="content">
        <!-- 进度条 -->
        <plan-navbar :progress="progress" class="plan-navbar" />
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

    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="addPlanVisible = true">新建计划</li>
      <li style="color: red" @click="delPlan">删除</li>
    </ul>

    <el-dialog
      title="新建计划"
      :visible.sync="addPlanVisible"
      width="90%"
      top="4vh"
      @closed="closePlanDialog"
    >
      <div class="plan-dialog-container">
        <div class="plan-dialog-content">
          <div v-if="addPlanVisible" style="border: 1px solid #eee;">
            <Toolbar
              style="border-bottom: 1px solid #eee"
              :editor="editor"
              :default-config="toolbarConfig"
              :mode="mode"
            />
            <Editor
              v-model="html"
              style="height: 300px; overflow-y: hidden;"
              :default-config="editorConfig"
              :mode="mode"
              @onCreated="onCreated"
            />
          </div>
          <el-input v-for="i in 20" :key="i" placeholder="请输入内容" />
          <div>hello</div>
        </div>
        <div class="plan-dialog-attribute">
          <el-input v-for="i in 20" :key="i" placeholder="请输入内容" />
          <div>hello</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addPlanVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProject">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import PlanNavbar from '@/components/PlanNavbar'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import config from '@/config/wangEditor'

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
  components: { PlanNavbar, Editor, Toolbar },
  data() {
    const { editorConfig, toolbarConfig } = config
    return {
      planAvatarShow: true, // 完成情况卡片的展示
      // === 鼠标右键计划列表start
      visible: false,
      top: 0,
      left: 0,
      // === 鼠标右键计划列表end
      // ===富文本编辑器start
      editor: null,
      html: '',
      toolbarConfig,
      editorConfig,
      mode: 'default', // or 'simple'
      // ===富文本编辑器end
      curData: null,
      curNode: null,
      addPlanVisible: false,
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
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2',
          children: [{
            id: 11,
            label: '三级 3-2-1'
          }, {
            id: 12,
            label: '三级 3-2-2'
          }, {
            id: 13,
            label: '三级 3-2-3'
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
    ...mapGetters(['curProId']),
    haveTagsView() {
      // TagsView高 34px
      return this.$store.state.settings.tagsView
    },
    userCount() {
      return this.planUsers ? this.planUsers.length : 0
    },
    allTaskCount() {
      return this.planUsers ? this.planUsers.reduce((cur, user) => user.taskCount + cur, 0) : 0
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
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    // 获取到当前选择项目的id
    // 如果id为空，说明没选，跳转到/mission/projects
    if (!this.curProId) {
      this.$router.push('/mission/projects')
      return
    }
    // todo 向后端请求，根据项目id查询所有计划
  },
  beforeDestroy() {
    this.closeEditor()
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    handleNodeClick(data, node) {
      console.log('当前节点是数据是', data)
      console.log('当前节点是', node)
      if (node.isLeaf) {
        console.log('当前选中的是叶子节点')
      } else {
        console.log('当前选中的不是叶子节点')
      }
      this.closeMenu()
    },
    handleContextmenu(event, data, node) {
      this.curData = data
      this.curNode = node
      const offsetLeft = this.$el.getBoundingClientRect().left // 表示获取组件根元素左边缘相对于视口左边缘的距离，也就是组件根元素在视口中的相对位置的左边距。
      const left = event.pageX - offsetLeft + 15 // 15: margin right
      this.left = left
      this.top = event.pageY
      this.visible = true
    },
    closeMenu() {
      this.visible = false
    },
    appendPlan() {
      this.addPlanVisible = true
      this.$refs.planTree.append({
        id: 13,
        label: '新建的计划'
      }, this.curNode)
      this.$message({
        type: 'success',
        message: '新建成功!'
      })
    },
    delPlan() {
      this.$confirm('此操作将永久删除该计划及其任务, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.planTree.remove(this.curNode)
        // todo 发请求给后端
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    closePlanDialog() {
      console.log('关闭新建计划')
      console.log(this.html)
      this.html = ''
    },
    addProject() {

    },
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    closeEditor() {
      const editor = this.editor
      if (editor == null) return
      editor.destroy() // 组件销毁时，及时销毁编辑器
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
  margin: 30px 0; // 用于撑开整个卡片栏
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
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}
.btn {
  padding: 5px 15px;
  margin-left: 10px;
}
.navbar-plan-item {
  height: 40px;
  display: flex;
  align-items: center; /* 垂直居中 */
  border-bottom: 1px solid #e7eaee;
  border-top: 1px solid #e7eaee;
  border-right: 1px solid #e7eaee;
}
::v-deep .el-dialog__body {
  padding: 30px 20px 0;
}
.plan-dialog-container {
  display: flex;
  height: 510px;
}
.plan-dialog-content {
  width: 66%;
  margin-right: 10px;
  // overflow-y: hidden;
  overflow-x: hidden;
  // overflow: auto;
}
.plan-dialog-attribute {
  width: 34%;
  margin-left: 10px;
  overflow-y: hidden;
  overflow: auto;
}

</style>
