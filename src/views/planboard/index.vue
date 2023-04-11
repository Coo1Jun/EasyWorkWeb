<template>
  <div class="container">
    <div class="plan-container">
      <!-- 左边的计划栏 -->
      <div class="sidebar">
        <div class="navbar-plan-item">
          <el-button-group>
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
          </el-button-group>
        </div>
        <el-tree
          ref="planTree"
          :data="planSet"
          node-key="id"
          highlight-current
          :props="planSetProps"
          @node-click="handleNodeClick"
          @node-contextmenu="handleContextmenu"
        />
      </div>
      <!-- 右边的卡片内容 -->
      <div v-if="curEpic" class="content">
        <!-- 进度条 -->
        <plan-navbar :progress="statistics.percentage" class="plan-navbar" @openDialog="openWorkItemDialog" />
        <!-- plan-avatar 所有人完成情况 -->
        <div v-if="planAvatarShow" class="plan-avatar">
          <div class="plan-avatar-average">
            <div>{{ statistics.averageTasks }}</div>
            <div style="color: #909399; width: 80px; text-align: center">
              人均卡片
            </div>
          </div>
          <div v-horizontal-scroll class="plan-completed">
            <el-menu
              default-active="all"
              mode="horizontal"
              :style="{ width: statistics.userCount * 100 + 100 + 'px' }"
              @select="handleSelect"
            >
              <el-menu-item index="all">
                <el-avatar
                  :size="'large'"
                  src="https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/el_default_user.png"
                />
                <div class="username">所有</div>
                <div>{{ statistics.allCompletedTasks }} / {{ statistics.allTaskCount }}</div>
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
                    :src="user.portrait"
                  />
                  <div class="username">{{ user.username }}</div>
                  <div>{{ user.completedTasks }} / {{ user.taskCount }}</div>
                </el-menu-item>
              </el-tooltip>
            </el-menu>
          </div>
          <div class="plan-task-summary">
            <div>
              <div>{{ statistics.remainingTime }}天</div>
              <div style="color: #909399; width: 80px">剩余时间</div>
            </div>
            <div>
              <div>{{ statistics.remainingTasks }}</div>
              <div style="color: #909399; width: 80px">剩余卡片</div>
            </div>
            <div>
              <div>{{ statistics.delayedTasks }}</div>
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
        <PlanCard ref="PlanCard" :cur-project="curProject" :cur-epic="curEpic" @refreshParentData="refreshParentData" />
      </div>
      <div v-else>
        hello
      </div>
    </div>

    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li v-if="curData && curData.workType === 'Plans'" @click="openPlanDialog">新建计划</li>
      <li v-if="curData && curData.workType === 'Epic'" @click="showEpic">查看</li>
      <li style="color: red" @click="delPlan">删除</li>
    </ul>

    <div class="deepDialog">
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
                ref="newWorkItem1"
                :model="newWorkItem"
                label-width="80px"
                label-position="top"
                :rules="newWorkItemRules"
              >
                <el-form-item label="标题" prop="title">
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
                v-model="newWorkItem.description"
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
              ref="newWorkItem2"
              :model="newWorkItem"
              label-width="80px"
              label-position="top"
              :rules="newWorkItemRules"
            >
              <el-form-item label="所属项目" prop="parentProId">
                <el-input
                  :value="curProject && curProject.projectName"
                  placeholder="请输入内容"
                  disabled
                />
              </el-form-item>
              <el-form-item v-if="workDialog.isEpic" label="所属计划集" prop="parentPlanSetId">
                <el-select
                  v-model="newWorkItem.parentPlanSetId"
                  placeholder="请选择计划集"
                  style="width: 100%"
                  filterable
                  clearable
                >
                  <el-option
                    v-for="plans in planSet"
                    :key="plans.id"
                    :label="plans.title"
                    :value="plans.id"
                  />
                </el-select>
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
                  placeholder="请选择父工作项"
                  style="width: 100%"
                  filterable
                  :disabled="newWorkItem.workType === 'Feature'"
                >
                  <!-- 当前项目、Epic（计划）是知道的，所以应该遍历当前Epic下对应的父工作项 -->
                  <el-option
                    v-for="work in parentWorkItemOptions"
                    :key="work.id"
                    :label="work.title"
                    :value="work.id"
                  />
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
                    :key="m.userId"
                    :label="m.name"
                    :value="m.userId"
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
    </div>
    <div class="deepDialog">
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
          :rules="plansSetRules"
        >
          <el-form-item label="标题" prop="title">
            <el-input
              v-model="newPlanSet.title"
              placeholder="请输入标题"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="newPlanSetVisiable = false">取 消</el-button>
          <el-button type="primary" @click="addPlans">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <CardPreview
      :visable="workItemVisible"
      :work-item-preview="curWorkItemPreview"
      :cur-project="curProject"
      @set-visable="setWorkItemVisible"
      @refreshPlanCardData="refreshPlanCardData"
    />
  </div>
</template>

<script>
import PlanNavbar from '@/components/PlanNavbar'
import PlanCard from '@/components/PlanCard'
import CardPreview from '@/components/CardPreview'
import Vue from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import config from '@/config/wangEditor'
import { uploadUrl } from '@/api/file'
import {
  addPlansApi,
  addWorkItemApi,
  getPlansApi,
  getWorkItemListApi,
  getWorkItemUserListApi,
  getWorkItemStatisticsApi,
  getWorkItemByIdApi
} from '@/api/workitem'
import { getProjectInfoApi } from '@/api/project'
import { getMemberListByGroupIdApi } from '@/api/group'

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
  components: { PlanNavbar, Editor, Toolbar, PlanCard, CardPreview },
  data() {
    const { editorConfig, toolbarConfig } = config
    const validTitle = (rule, value, callback) => {
      if (!value) {
        callback(new Error('标题不能为空'))
      } else {
        callback()
      }
    }
    const validDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('完成时间不能为空'))
      } else {
        callback()
      }
    }
    const validParentWorkItem = (rule, value, callback) => {
      if (!value) {
        callback(new Error('所属父工作项不能为空'))
      } else {
        callback()
      }
    }
    const validWorkType = (rule, value, callback) => {
      if (!value) {
        callback(new Error('工作项类型不能为空'))
      } else {
        callback()
      }
    }
    return {
      curProject: {},
      curEpic: null,
      members: [], // 团队成员
      parentWorkItemOptions: [], // 父工作项的选项，根据不同的工作项类型而改变
      workItemMap: {},
      statistics: {}, // 统计信息
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
      planUsers: [],
      planSet: [], // 计划集
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'isPlanSet'
      },
      planSetProps: {
        children: 'children',
        value: 'id',
        label: 'title'
      },
      // 新建计划集 start
      newPlanSetVisiable: false,
      newPlanSet: {
        title: '' // 标题
      },
      // 新建计划集 end
      // 新建工作项：新建计划、新建卡片等等 start
      newWorkItem: {
        title: '', // 标题
        description: '', // 描述
        fileIdList: [], // 附件
        parentProId: '', // 所属项目
        parentPlanSetId: null, // 所属计划集
        parentWorkItemId: null, // 除了Epic，其他工作项类型都有所属，比如Feature所属Epic下
        workType: '', // 工作项类型：Epic、Feature、Story、Task、Bug
        principal: null, // 负责人
        duration: null, // 持续时间
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
      },
      // 新建工作项 dialog属性 end
      // 校验规则 start =====================
      plansSetRules: {
        title: [
          { required: true, trigger: 'blur', validator: validTitle }
        ]
      },
      newWorkItemRules: {
        title: [
          { required: true, trigger: 'blur', validator: validTitle }
        ],
        duration: [
          { required: true, trigger: 'blur', validator: validDate }
        ],
        parentWorkItemId: [
          { required: true, trigger: 'blur', validator: validParentWorkItem }
        ],
        workType: [
          { required: true, trigger: 'blur', validator: validWorkType }
        ]
      },
      // 校验规则 end =====================
      workItemVisible: false,
      curWorkItemPreview: {}
    }
  },
  computed: {
    haveTagsView() {
      // TagsView高 34px
      return this.$store.state.settings.tagsView
    },
    curEpicId: {
      get() {
        return this.$store.state.project.curEpicId
      },
      set(val) {
        this.$store.dispatch('project/setCurEpicId', val)
      }
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
          this.newWorkItem.parentWorkItemId = null
          this.parentWorkItemOptions = this.workItemMap['Feature']
          break
        case 'Task':
        case 'Bug':
          this.workDialog.parentWorkItemTitle = '所属Story'
          this.newWorkItem.parentWorkItemId = null
          this.parentWorkItemOptions = this.workItemMap['Story']
          break
        default:
          this.workDialog.parentWorkItemTitle = '所属Epic'
          this.newWorkItem.parentWorkItemId = this.curEpic ? this.curEpic.id : ''
          this.parentWorkItemOptions = []
          this.parentWorkItemOptions.push(this.curEpic)
      }
    },
    curEpic(value) {
      if (value) {
        this.curEpicId = value.id
        this.getBasicData()
      }
    },
    '$route.query.projectId'(value) {
      if (!value) {
        this.$router.push('/mission/projects')
      }
    }
  },
  async mounted() {
    // 根据项目id获取项目信息
    const projectResponse = await getProjectInfoApi(this.$route.query.projectId)
    this.curProject = projectResponse.data
    // console.log('sssssssssssssss', this.curProject)
    if (this.curProject == null) {
      this.$router.push('/mission/projects')
    }
    // 后端获取计划集
    getPlansApi({ projectId: this.$route.query.projectId }).then(res => {
      this.planSet = res.data
    })
    // 根据项目组id获取用户信息列表
    getMemberListByGroupIdApi(this.curProject.groupId).then(res => {
      this.members = res.data
    })
    // 根据当前EpicId查出工作项
    if (this.curEpicId !== null) {
      getWorkItemByIdApi({
        projectId: this.curProject.projectId,
        EpicId: this.curEpicId
      }).then(res => {
        if (res.data) {
          this.curEpic = res.data
          this.getBasicData()
        }
      })
    }
    // todo 向后端请求，根据项目id查询所有计划
  },
  beforeRouteEnter(to, from, next) {
    // 如果id为空，说明没选，跳转到/mission/projects
    if (!to.query.projectId) {
      next('/mission/projects')
    } else {
      next()
    }
  },
  beforeDestroy() {
    this.closeEditor()
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    handleNodeClick(data, node) {
      if (data.workType === 'Epic') {
        this.curEpic = data
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
    },
    closeMenu() {
      this.visible = false
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
      this.curData = null
      this.curNode = null
      if (this.$refs.newPlanSet) this.$refs.newPlanSet.resetFields()
      this.newWorkItemReset()
      console.log('关闭新建计划', this.newWorkItem)
    },
    addProject() {
      let titleValid
      this.$refs.newWorkItem1.validate(valid => { titleValid = valid })
      // 标题校验不通过，直接结束
      if (!titleValid) return
      this.$refs.newWorkItem2.validate(async(valid) => {
        if (valid) {
          let curEpicId
          if (this.newWorkItem.workType === 'Plans' || this.newWorkItem.workType === 'Epic') {
            curEpicId = null
          } else {
            curEpicId = this.curEpic.id
          }
          const { success } = await addWorkItemApi({
            title: this.newWorkItem.title,
            description: this.newWorkItem.description,
            fileList: this.newWorkItem.fileIdList,
            projectId: this.curProject.projectId,
            plansId: this.newWorkItem.parentPlanSetId,
            parentWorkItemId: this.newWorkItem.parentWorkItemId,
            workType: this.newWorkItem.workType,
            principalId: this.newWorkItem.principal,
            startTime: this.newWorkItem.duration[0],
            endTime: this.newWorkItem.duration[1],
            priority: this.newWorkItem.priority,
            risk: this.newWorkItem.risk,
            epicId: curEpicId
          })
          if (success) {
            this.addWorkItemVisible = false
            this.$message({
              message: '添加成功',
              type: 'success',
              duration: 3000 // 持续时间为 3 秒
            })
            // 发请求 刷新页面数据
            // 1.请求计划集
            getPlansApi({ projectId: this.$route.query.projectId }).then(res => {
              this.planSet = res.data
            })
            // 2.请求工作项
            // 3.刷新子组件的数据
            if (this.curEpic) {
              this.$refs.PlanCard.refreshData()
            }
            // 4.刷新工作项数据
            this.getBasicData()
          }
        } else {
          return false
        }
      })
    },
    // 重置表单
    newWorkItemReset() {
      this.newWorkItem = {
        title: '', // 标题
        description: '', // 描述
        fileIdList: [], // 附件
        parentProId: '', // 所属项目
        parentPlanSetId: null, // 所属计划集
        parentWorkItemId: null, // 除了Epic，其他工作项类型都有所属，比如Feature所属Epic下
        workType: '', // 工作项类型：Epic、Feature、Story、Task、Bug
        principal: null, // 负责人
        duration: null, // 持续时间
        priority: 0, // 优先级
        risk: 0, // 风险
        severity: '' // 严重程度 Bug类别
      }
    },
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
      if (this.curData && this.curData.workType === 'Plans') {
        this.newWorkItem.parentPlanSetId = this.curData.id
      }
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
    },
    addPlans() {
      this.$refs.newPlanSet.validate(async(valid) => {
        if (valid) {
          const { success } = await addPlansApi({
            projectId: this.curProject.projectId,
            title: this.newPlanSet.title
          })
          if (success) {
            this.newPlanSetVisiable = false
            this.$message({
              message: '添加成功',
              type: 'success',
              duration: 3000 // 持续时间为 3 秒
            })
          }
          // 发请求 刷新页面数据
          getPlansApi({ projectId: this.$route.query.projectId }).then(res => {
            this.planSet = res.data
          })
        } else {
          return false
        }
      })
    },
    getBasicData() {
      if (this.curEpic) {
        getWorkItemListApi({
          projectId: this.curProject.projectId,
          EpicId: this.curEpicId
        }).then(res => {
          this.workItemMap = res.data
        })
        // 根据项目id和EpicId获取参与项目工作的用户基本信息
        getWorkItemUserListApi({
          projectId: this.curProject.projectId,
          EpicId: this.curEpicId
        }).then(res => {
          this.planUsers = res.data
        })
        // 根据项目id和EpicId，计算工作项统计信息
        getWorkItemStatisticsApi({
          projectId: this.curProject.projectId,
          EpicId: this.curEpicId
        }).then(res => {
          this.statistics = res.data
        })
      }
    },
    refreshParentData() {
      this.getBasicData()
    },
    showEpic() {
      this.curWorkItemPreview = JSON.parse(JSON.stringify(this.curData))
      console.log(this.curWorkItemPreview)
      this.workItemVisible = true
    },
    setWorkItemVisible(value) {
      this.workItemVisible = value
    },
    refreshPlanCardData() {
      // 后端获取计划集
      getPlansApi({ projectId: this.$route.query.projectId }).then(res => {
        this.planSet = res.data
      })
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
::v-deep .deepDialog * .el-dialog__body {
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
