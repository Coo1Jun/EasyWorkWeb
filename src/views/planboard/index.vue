<template>
  <div class="container">
    <div class="plan-container">
      <!-- 左边的计划栏 -->
      <div class="sidebar">
        <div class="navbar-plan-item">
          <el-button
            class="btn"
            type="primary"
            @click="openPlanSetDialog"
          >
            新建计划集
          </el-button>
          <el-button
            class="btn"
            type="primary"
            @click="openPlanDialog"
          >
            新建计划
          </el-button>
        </div>
        <el-tree
          ref="planTree"
          :data="planSet"
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
        <plan-navbar :progress="progress" class="plan-navbar" @openDialog="openWorkItemDialog" />
        <!-- plan-avatar 所有人完成情况 -->
        <div v-if="planAvatarShow" class="plan-avatar">
          <div class="plan-avatar-average">
            <div>{{ averageTasks }}</div>
            <div style="color: #909399; width: 80px; text-align: center">
              人均卡片
            </div>
          </div>
          <div v-horizontal-scroll class="plan-completed">
            <el-menu
              default-active="all"
              mode="horizontal"
              :style="{ width: userCount * 100 + 100 + 'px' }"
              @select="handleSelect"
            >
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
              <div style="color: #909399; width: 80px">剩余时间</div>
            </div>
            <div>
              <div>{{ remainingTasks }}</div>
              <div style="color: #909399; width: 80px">剩余卡片</div>
            </div>
            <div>
              <div>{{ 0 }}</div>
              <div style="color: #909399; width: 80px">延期卡片</div>
            </div>
          </div>
        </div>
        <div class="plan-avatar-btn">
          <button
            v-if="planAvatarShow"
            @click="planAvatarShow = !planAvatarShow"
          >
            <i class="el-icon-arrow-up" />
          </button>
          <button
            v-if="!planAvatarShow"
            @click="planAvatarShow = !planAvatarShow"
          >
            <i class="el-icon-arrow-down" />
          </button>
        </div>
        <PlanCard />
      </div>
    </div>

    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li v-if="curData && !curData.isPlanSet" @click="openPlanSetDialog">新建计划集</li>
      <li v-if="curData && !curData.isPlanSet" @click="openPlanDialog">新建计划</li>
      <li v-if="curData && curData.isPlanSet" @click="addWorkItemVisible = false">查看</li>
      <li style="color: red" @click="delPlan">删除</li>
    </ul>

    <!-- 新建工作项dialog -->
    <el-dialog
      :title="workDialog.title"
      :visible.sync="addWorkItemVisible"
      width="90%"
      top="4vh"
      :close-on-press-escape="false"
      @closed="closePlanDialog"
    >
      <div class="plan-dialog-container">
        <!-- 左边内容区 -->
        <div class="plan-dialog-content">
          <!-- 标题 -->
          <div class="work-tiem-title">
            <el-form
              ref="newWorkItem"
              :model="newWorkItem"
              label-width="80px"
              label-position="top"
            >
              <el-form-item label="标题">
                <el-input
                  v-model="newWorkItem.title"
                  placeholder="请输入标题"
                />
              </el-form-item>
            </el-form>
          </div>
          <!-- 富文本编辑器 -->
          <div style="margin-bottom: 10px">描述</div>
          <div v-if="addWorkItemVisible" style="border: 1px solid #eee">
            <Toolbar
              style="border-bottom: 1px solid #eee"
              :editor="editor"
              :default-config="toolbarConfig"
              :mode="mode"
            />
            <Editor
              v-model="html"
              style="height: 300px; overflow-y: hidden"
              :default-config="editorConfig"
              :mode="mode"
              @onCreated="onCreated"
            />
          </div>
          <div class="file-upload">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              multiple
              :file-list="defaultFileList"
            >
              <el-badge :hidden="newWorkItem.fileIdList.length === 0" :value="newWorkItem.fileIdList.length" class="item" type="primary">
                <span style="margin-right: 10px">附件</span>
              </el-badge>
              <el-button style="margin-left: 15px" size="mini" icon="el-icon-plus" circle />
            </el-upload>
          </div>
        </div>
        <!-- 右边属性区 -->
        <div class="plan-dialog-attribute">
          <el-form
            ref="newWorkItem"
            :model="newWorkItem"
            label-width="80px"
            label-position="top"
          >
            <el-form-item label="所属项目" prop="parentProId">
              <el-input
                :value="curProject && curProject.projectName"
                placeholder="请输入内容"
                disabled
              />
            </el-form-item>
            <el-form-item v-if="workDialog.isEpic" label="所属计划集" prop="parentPlanSetIds">
              <el-cascader
                v-model="newWorkItem.parentPlanSetIds"
                :options="parentPlanSet"
                :props="planSetProps"
                style="width: 100%"
              />
              <!-- <el-select
                v-model="newWorkItem.parentProId"
                placeholder="请选择项目"
                style="width: 100%"
                filterable
              >
                <el-option
                  :label="curProject.projectName"
                  :value="curProject.id"
                />
              </el-select> -->
            </el-form-item>
            <el-form-item label="工作项类型" prop="workType">
              <el-select
                v-model="newWorkItem.workType"
                placeholder="请选择工作项类型"
                style="width: 100%"
                :disabled="workDialog.isEpic"
              >
                <!-- <el-option label="Epic" value="Epic" /> -->
                <el-option label="Feature" value="Feature" />
                <el-option label="Story" value="Story" />
                <el-option label="Task" value="Task" />
                <el-option label="Bug" value="Bug" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="!workDialog.isEpic" :label="workDialog.parentWorkItemTitle" prop="parentWorkItemId">
              <el-select
                v-model="newWorkItem.parentWorkItemId"
                placeholder="请选择标题"
                style="width: 100%"
                filterable
              >
                <!-- 当前项目、Epic（计划）是知道的，所以应该遍历当前Epic下对应的父工作项 -->
                <!-- <el-option
                  :label="curProject.projectName"
                  :value="curProject.id"
                /> -->
              </el-select>
            </el-form-item>
            <el-form-item label="负责人" prop="principal">
              <el-select
                v-model="newWorkItem.principal"
                placeholder="请选择负责人"
                style="width: 100%"
                filterable
                clearable
              >
                <el-option
                  v-for="m in members"
                  :key="m.id"
                  :label="m.name"
                  :value="m.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="完成时间" prop="duration">
              <el-date-picker
                v-model="newWorkItem.duration"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item label="优先级" prop="priority">
              <el-rate
                v-model="newWorkItem.priority"
                show-text
                :texts="['最低', '较低', '普通', '较高', '最高']"
                :colors=" { 1: '#73d897', 3: { value: '#6698ff', excluded: true }, 4: { value: '#f6c659', excluded: true }, 5: { value: '#ff9f73', excluded: true }, 6: '#ff7575' }"
                @change="priorityCheck"
              />
            </el-form-item>
            <el-form-item label="风险" prop="risk">
              <el-rate
                v-model="newWorkItem.risk"
                show-text
                :texts="['低', '中', '高']"
                :colors=" { 1: '#73d897', 3: { value: '#f6c659', excluded: true }, 4: '#ff7575' }"
                :max="3"
                @change="riskCheck"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addWorkItemVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProject">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新建计划集dialog -->
    <el-dialog
      title="新建计划集"
      :visible.sync="newPlanSetVisiable"
      width="30%"
      @closed="closePlanDialog"
    >
      <el-form
        ref="newPlanSet"
        :model="newPlanSet"
        label-width="80px"
        label-position="top"
      >
        <el-form-item label="所属计划集" prop="parentPlanSetIds">
          <el-cascader
            v-model="newPlanSet.parentPlanSetIds"
            :options="parentPlanSet"
            :props="planSetProps"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="标题">
          <el-input
            v-model="newPlanSet.title"
            placeholder="请输入标题"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newPlanSetVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addProject">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PlanNavbar from '@/components/PlanNavbar'
import PlanCard from '@/components/PlanCard'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import config from '@/config/wangEditor'
import { uploadUrl } from '@/api/file'

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
  components: { PlanNavbar, Editor, Toolbar, PlanCard },
  data() {
    const { editorConfig, toolbarConfig } = config
    return {
      members: [{ id: 1, name: '李正帆' }, { id: 2, name: '李正帆测试1' }, { id: 3, name: '李正帆测试2' }], // 团队成员
      projects: [{ id: 1, name: '项目1' }, { id: 2, name: '项目2' }, { id: 3, name: '项目3' }], // 所有项目
      uploadUrl,
      defaultFileList: [
        // {
        //   name: 'hello.png',
        //   url: 'https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/121ffeea3ca84124a8547ebccc0d3c83.png'
        // }
      ],
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
      // dialog新建工作项 start
      addWorkItemVisible: false,
      riskColor: '',
      riskActiveClass: '',
      priorityActiveClass: '',
      // dialog新建工作项 end
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
      planSet: [
        {
          id: 1,
          label: '一级 1',
          isPlanSet: false,
          children: [
            {
              id: 4,
              label: '二级 1-1',
              isPlanSet: false,
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1',
                  isPlanSet: true
                },
                {
                  id: 10,
                  label: '三级 1-1-2',
                  isPlanSet: true
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '一级 2',
          isPlanSet: false,
          children: [
            {
              id: 5,
              label: '二级 2-1',
              isPlanSet: true
            },
            {
              id: 6,
              label: '二级 2-2',
              isPlanSet: true
            }
          ]
        },
        {
          id: 3,
          label: '一级 3',
          isPlanSet: false,
          children: [
            {
              id: 7,
              label: '二级 3-1',
              isPlanSet: true
            },
            {
              id: 8,
              label: '二级 3-2',
              isPlanSet: false,
              children: [
                {
                  id: 11,
                  label: '三级 3-2-1',
                  isPlanSet: true
                },
                {
                  id: 12,
                  label: '三级 3-2-2',
                  isPlanSet: true
                },
                {
                  id: 13,
                  label: '三级 3-2-3',
                  isPlanSet: true
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'isPlanSet'
      },
      planSetProps: {
        children: 'children',
        value: 'id',
        label: 'label'
      },
      // 新建计划集 start
      newPlanSetVisiable: false,
      newPlanSet: {
        parentPlanSetIds: '', // 所属父计划集
        title: '' // 标题
      },
      // 新建计划集 end
      // 新建工作项：新建计划、新建卡片等等 start
      newWorkItem: {
        title: '', // 标题
        desc: '', // 描述
        fileIdList: [], // 附件
        parentProId: '', // 所属项目
        parentPlanSetIds: [], // 所属计划集,数组的元素分别是一级一级往下传递，比如['a','b','c']表示，计划集为 a/b/c
        parentWorkItemId: '', // 除了Epic，其他工作项类型都有所属，比如Feature所属Epic下
        workType: '', // 工作项类型：Epic、Feature、Story、Task、Bug
        principal: '', // 负责人
        duration: null, // 持续时间
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        priority: 0, // 优先级
        risk: 0, // 风险
        severity: '' // 严重程度 Bug类别
      },
      riskOldValue: 0,
      priorityOldValue: 0,
      // 新建工作项：新建计划、新建卡片等等 end
      // 新建工作项 dialog属性 start
      workDialog: {
        title: '',
        isEpic: false,
        parentWorkItemTitle: ''
      }
      // 新建工作项 dialog属性 end
    }
  },
  computed: {
    ...mapGetters(['curProject']),
    haveTagsView() {
      // TagsView高 34px
      return this.$store.state.settings.tagsView
    },
    userCount() {
      return this.planUsers ? this.planUsers.length : 0
    },
    allTaskCount() {
      return this.planUsers
        ? this.planUsers.reduce((cur, user) => user.taskCount + cur, 0)
        : 0
    },
    allCompletedTasks() {
      return this.planUsers
        ? this.planUsers.reduce((cur, user) => user.completedTasks + cur, 0)
        : 0
    },
    averageTasks() {
      return parseFloat((this.allTaskCount / this.userCount).toFixed(1))
    },
    progress() {
      return Math.ceil((this.allCompletedTasks / this.allTaskCount) * 100)
    },
    remainingTasks() {
      return this.allTaskCount - this.allCompletedTasks
    },
    parentPlanSet() {
      return null
    }
  },
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    },
    'newWorkItem.workType'(value) {
      switch (value) {
        case 'Story':
          this.workDialog.parentWorkItemTitle = '所属Feature'
          break
        case 'Task':
        case 'Bug':
          this.workDialog.parentWorkItemTitle = '所属Story'
          break
        default:
          this.workDialog.parentWorkItemTitle = '所属Epic'
      }
    }
  },
  mounted() {
    // 获取到当前选择项目的id
    // 如果id为空，说明没选，跳转到/mission/projects
    if (!(this.curProject && this.curProject.id)) {
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
      // 计算鼠标右键菜单的位置 start
      const offsetLeft = this.$el.getBoundingClientRect().left // 表示获取组件根元素左边缘相对于视口左边缘的距离，也就是组件根元素在视口中的相对位置的左边距。
      const left = event.pageX - offsetLeft + 15 // 15: margin right
      this.left = left
      this.top = event.pageY
      // 计算鼠标右键菜单的位置 end
      this.visible = true
      console.log(data)
      console.log(node)
    },
    closeMenu() {
      this.visible = false
    },
    appendPlan() {
      this.addWorkItemVisible = true
      // this.$refs.planTree.append(
      //   {
      //     id: 13,
      //     label: '新建的计划'
      //   },
      //   this.curNode
      // )
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
      })
        .then(() => {
          this.$refs.planTree.remove(this.curNode)
          // todo 发请求给后端
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
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
    addProject() {},
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    closeEditor() {
      const editor = this.editor
      if (editor == null) return
      editor.destroy() // 组件销毁时，及时销毁编辑器
    },
    handlePreview(file) {
      console.log(file)
      console.log(this.newWorkItem.fileIdList)
    },
    handleRemove(file, fileList) {
      console.log(file)
      console.log(fileList)
      this.newWorkItem.fileIdList = this.newWorkItem.fileIdList.filter(id => id !== file.response.data.id)
    },
    uploadSuccess(response, file, fileList) {
      this.newWorkItem.fileIdList.push(response.data.id)
    },
    uploadError() {
      this.$message({
        type: 'error',
        message: '附件上传失败，请稍后重试！',
        duration: 3000
      })
    },
    riskCheck(value) {
      if (value !== 0) {
        if (value === this.riskOldValue) {
          this.newWorkItem.risk = 0
          this.riskOldValue = 0
        } else {
          this.riskOldValue = value
        }
      }
    },
    priorityCheck(value) {
      if (value !== 0) {
        if (value === this.priorityOldValue) {
          this.newWorkItem.priority = 0
          this.priorityOldValue = 0
        } else {
          this.priorityOldValue = value
        }
      }
    },
    openPlanDialog() {
      this.workDialog.title = '新建计划'
      this.addWorkItemVisible = true
      this.newWorkItem.workType = 'Epic'
      this.workDialog.isEpic = true
    },
    openWorkItemDialog() {
      this.workDialog.title = '新建卡片'
      this.addWorkItemVisible = true
      this.newWorkItem.workType = ''
      this.workDialog.isEpic = false
      this.workDialog.parentWorkItemTitle = '所属Epic'
    },
    openPlanSetDialog() {
      this.newPlanSetVisiable = true
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  padding-bottom: 40px;
}

.plan-container {
  width: 100%;
  display: flex;
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
  .el-menu-item {
    // width: 100px;
    // overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .username {
      width: 60px;
      text-align: center;
      white-space: nowrap; /* 禁止文本换行 */
      overflow: hidden; /* 隐藏溢出的文本 */
      text-overflow: ellipsis; /* 显示省略号 */
      margin: 15px 0;
    }
  }
}
.el-menu--horizontal > .el-menu-item {
  height: 120px;
  line-height: inherit;
  margin-bottom: 5px;
}
.plan-task-summary {
  float: right;
  display: flex;
  align-items: center;
  padding: 30px 5px;
  text-align: center;
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
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
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
  padding: 0px 20px 0px;
}
::v-deep .el-form-item__label {
  padding: 0;
}
.plan-dialog-container {
  display: flex;
  height: 540px;
}
.plan-dialog-content {
  width: 70%;
  margin-right: 10px;
  padding-right: 20px;
  // overflow-y: hidden;
  overflow-x: hidden;
  // overflow: auto;
}
.plan-dialog-attribute {
  width: 30%;
  margin-left: 10px;
  padding-right: 10px;
  overflow-y: hidden;
  overflow: auto;
}
.file-upload {
  margin-top: 10px;
}
::v-deep .el-rate__icon {
  font-size: 30px;
}
.work-tiem-title {
  ::v-deep .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
