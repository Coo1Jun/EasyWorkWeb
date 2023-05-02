<template>
  <div>
    <el-dialog
      :title="workItem.workType"
      :visible.sync="workItemVisible"
      width="90%"
      top="4vh"
      :close-on-press-escape="false"
      @closed="closeDialog"
    >
      <div class="cp-container">
        <!-- 左边 -->
        <div class="cp-content">
          <div class="cp-content-input">
            <el-input
              ref="titleInput"
              v-model="workItem.title"
              placeholder="请输入标题"
              @blur="workItemTitleBlur"
            />
          </div>
          <!-- 负责人、流程状态、完成时间 -->
          <div class="cp-content-attribute">
            <div>
              <div style="margin-bottom: 10px;">负责人</div>
              <el-select
                ref="principalSelect"
                v-model="workItem.principalId"
                placeholder="请选择负责人"
                filterable
                clearable
                @change="principalChange"
              >
                <el-option
                  v-for="m in members"
                  :key="m.userId"
                  :label="m.name"
                  :value="m.userId"
                />
              </el-select>
            </div>
            <div style="margin-left: 10px;margin-right: 10px">
              <div style="margin-bottom: 10px;">流程状态</div>
              <el-select
                ref="stateSelect"
                v-model="workItem.status"
                filterable
                :disabled="workItem.workType === 'Epic'"
                @change="stateChange"
              >
                <el-option
                  v-for="(s, index) in states"
                  :key="index"
                  :label="s"
                  :value="s"
                />
              </el-select>
            </div>
            <div>
              <div style="margin-bottom: 10px">完成时间</div>
              <el-date-picker
                v-model="duration"
                :clearable="false"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                @change="durationChange"
              />
              <el-tag v-if="new Date().getTime() - new Date(workItem.endTime).getTime() > 0 && workItem.endFlag === 0" style="margin-left: 10px" type="danger">已延期</el-tag>
              <el-tag v-else-if="workItem.status === '已完成'" style="margin-left: 10px" type="success">已完成</el-tag>
              <el-tag v-else-if="workItem.status === '未复现' || workItem.status === '已取消' || workItem.status === '关闭'" style="margin-left: 10px" type="info">{{ workItem.status }}</el-tag>
            </div>
          </div>
          <!--  -->
          <div>
            <el-tabs v-model="tabsActiveName">
              <el-tab-pane label="基本信息" name="basicInfo">
                <div style="margin-bottom: 10px">
                  <span>描述</span>
                  <el-link v-if="!editorVisable" style="color: #409eff;margin-left: 20px" @click="editDesc">编辑</el-link>
                  <el-link v-if="editorVisable" style="color: #409eff;margin-left: 20px" @click="saveDesc">保存</el-link>
                  <el-link v-if="workItem.description !== oldDesc" style="color: #409eff;margin-left: 20px" @click="cancelEditing">取消编辑</el-link>
                </div>
                <div v-if="editorVisable">
                  <div v-if="workItemVisible" style="border: 1px solid #eee">
                    <Toolbar
                      style="border-bottom: 1px solid #eee"
                      :editor="editor"
                      :default-config="toolbarConfig"
                      :mode="mode"
                    />
                    <Editor
                      v-model="workItem.description"
                      style="height: 300px; overflow-y: hidden"
                      :default-config="editorConfig"
                      :mode="mode"
                      @onCreated="onCreated"
                    />
                  </div>
                </div>
                <div v-else class="cp-desc" v-html="workItem.description" />
              </el-tab-pane>
              <el-tab-pane :label="tabPaneFileLabel" name="attachment">
                <el-upload
                  class="upload-demo"
                  :action="uploadUrl"
                  :on-preview="handlePreview"
                  :before-remove="handleBeforeRemove"
                  :on-remove="handleRemove"
                  :on-success="uploadSuccess"
                  :on-error="uploadError"
                  multiple
                  :file-list="defaultFileList"
                >
                  <span>附件</span>
                  <el-button style="margin-left: 10px" size="mini" icon="el-icon-plus" circle />
                </el-upload>
              </el-tab-pane>
              <el-tab-pane v-if="workItem.workType !== 'Epic'" :label="tabPaneSubWorkLabel" name="subWorkItem">
                <WorkItemList :work-items="workItem.children ? workItem.children : []" />
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <!-- 右边 -->
        <div class="cp-attribute">
          <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteWorkItem">删除工作项</el-button>
          <el-collapse v-model="collapseActiveName">
            <el-collapse-item title="属性" name="1">
              <div class="cp-attribute-item">
                <div style="width: 120px;font-size: 14px">优先级</div>
                <el-rate
                  v-model="workItem.priority"
                  show-text
                  :texts="['最低', '较低', '普通', '较高', '最高']"
                  :colors=" { 1: '#73d897', 3: { value: '#6698ff', excluded: true }, 4: { value: '#f6c659', excluded: true }, 5: { value: '#ff9f73', excluded: true }, 6: '#ff7575' }"
                  @change="priorityCheck"
                />
              </div>
              <div class="cp-attribute-item">
                <div style="width: 120px;font-size: 14px">风险</div>
                <el-rate
                  v-model="workItem.risk"
                  show-text
                  :texts="['低', '中', '高']"
                  :colors=" { 1: '#73d897', 3: { value: '#f6c659', excluded: true }, 4: '#ff7575' }"
                  :max="3"
                  @change="riskCheck"
                />
              </div>
            </el-collapse-item>
            <el-collapse-item title="基础信息" name="2">
              <div class="basic-info">
                <div>
                  <span class="basic-info-item">所属项目</span>
                  <span>{{ curProject.projectName }}</span>
                </div>
                <div>
                  <span class="basic-info-item">创建人</span>
                  <span style="margin-right: 5px"><el-avatar :size="'small'" :src="createUser && createUser.portrait" /></span>
                  <span>{{ createUser && createUser.realName }}</span>
                </div>
                <div>
                  <span class="basic-info-item">创建时间</span>
                  <span>{{ workItem.createTime }}</span>
                </div>
                <div>
                  <span class="basic-info-item">更新人</span>
                  <span style="margin-right: 5px"><el-avatar :size="'small'" :src="updateUser && updateUser.portrait" /></span>
                  <span>{{ updateUser && updateUser.realName }}</span>
                </div>
                <div>
                  <span class="basic-info-item">更新时间</span>
                  <span>{{ workItem.updateTime }}</span>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="操作"
      :visible.sync="fileOperationVisable"
      width="30%"
    >
      <span slot="footer" class="dialog-footer">
        <el-button @click="filePreview(curFile)">预 览</el-button>
        <el-button type="primary" @click="fileOperationVisable = false">
          <a :href="`http://localhost:8020/api/ew-server/file/download/${curFile.id}`">下载</a>
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import config from '@/config/wangEditor'
import WorkItemList from '@/components/WorkItemList'
import { uploadUrl } from '@/api/file'
import { getMemberListByGroupIdApi } from '@/api/group'
import { getUserInfoApi } from '@/api/user'
import { editWorkItemApi, deleteWorkItemByIdApi, getSubWorkItemApi } from '@/api/workitem'
import * as base64Encode from 'js-base64'

export default {
  name: 'CardPreview',
  components: { Editor, Toolbar, WorkItemList },
  props: {
    visable: {
      type: Boolean,
      default: false
    },
    workItemPreview: {
      type: Object,
      required: true
    },
    curProject: {
      type: Object,
      required: true
    }
  },
  data() {
    const { editorConfig, toolbarConfig } = config
    return {
      uploadUrl,
      defaultFileList: [],
      fileOperationVisable: false,
      curFile: {},
      members: [], // 团队成员
      workItemVisible: false,
      collapseActiveName: ['1', '2'], // collapse默认展开的菜单
      tabsActiveName: 'basicInfo', // tabs默认展开的菜单
      priorityOldValue: 0, // 优先级的旧值
      riskOldValue: 0, // 优先级的旧值
      states: [], // 流程状态
      // ===富文本编辑器start
      editorVisable: false,
      editor: null,
      html: '',
      toolbarConfig,
      editorConfig,
      mode: 'default', // or 'simple'
      // ===富文本编辑器end
      workItem: {
        title: '',
        priority: 0,
        risk: 0,
        workType: '',
        principal: '', // 负责人
        state: '', // 状态
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        fileList: [], // 附件
        description: '', // 描述
        children: []
      },
      duration: [], // 完成时间，有两个值，第一个为开始时间，第二个为结束时间
      oldDesc: '', // 描述的旧值，用于取消编辑时
      oldTitle: '', // 标题的旧值
      oldStatus: '', // 状态的旧值
      oldPrincipalId: '', // 负责人的旧值
      oldPriority: 0, // 优先级旧值
      oldRisk: 0, // 风险等级旧值
      createUser: {}, // 创建人信息
      updateUser: {}, // 更新人信息
      fileIdList: [], // 附件id列表（实时）
      oldFileIdList: [] // 附件id列表的旧值
    }
  },
  computed: {
    ...mapGetters(['defaultStates', 'TaskStates', 'BugStates']),
    tabPaneFileLabel() {
      let label = '附件'
      if (this.fileIdList && this.fileIdList.length > 0) {
        label += '(' + this.fileIdList.length + ')'
      }
      return label
    },
    tabPaneSubWorkLabel() {
      let label = '子工作项'
      if (this.workItem.children && this.workItem.children.length > 0) {
        label += '(' + this.workItem.children.length + ')'
      }
      return label
    }
  },
  watch: {
    visable(newVal) {
      this.workItemVisible = newVal
    },
    workItemPreview(value) {
      this.workItem = value
      // 获取子工作项
      if (!this.workItem.children) {
        getSubWorkItemApi(this.workItemPreview.id).then(res => {
          this.workItem.children = res.data
        }).catch(() => {})
      }
      // console.log(value)
      // 判断当前的workType，选择对应的states
      if (this.workItem.workType === 'Feature' || this.workItem.workType === 'Story') {
        this.states = this.defaultStates
      } else if (this.workItem.workType === 'Task') {
        this.states = this.TaskStates
      } else if (this.workItem.workType === 'Bug') {
        this.states = this.BugStates
      }
      // 赋值用于显示完成时间
      this.duration = []
      this.duration.push(this.workItem.startTime)
      this.duration.push(this.workItem.endTime)
      // 保存旧值
      this.oldDesc = this.workItem.description
      this.oldTitle = this.workItem.title
      this.oldStatus = this.workItem.status
      this.oldPrincipalId = this.workItem.principalId
      this.oldPriority = this.workItem.priority
      this.priorityOldValue = this.workItem.priority
      this.oldRisk = this.workItem.risk
      this.riskOldValue = this.workItem.risk
      // 获取创建人和更新人信息
      getUserInfoApi(this.workItem.createId).then(res => {
        this.createUser = res.data
      })
      getUserInfoApi(this.workItem.updateId).then(res => {
        this.updateUser = res.data
      })
      // 根据项目组id获取用户信息列表
      getMemberListByGroupIdApi(this.curProject.groupId).then(res => {
        this.members = res.data
      })
      // 附件信息
      this.fileIdList = []
      if (!this.workItem.fileList) {
        this.defaultFileList = []
      } else {
        this.defaultFileList = this.workItem.fileList
        for (const file of this.workItem.fileList) {
          this.fileIdList.push(file.id)
        }
      }
    }
  },
  beforeDestroy() {
    // 解绑所有自定义事件
    this.$off()
    // 销毁富文本编辑器
    this.closeEditor()
  },
  methods: {
    closeDialog() {
      this.$emit('set-visable', false)
      // 如果处于编辑状态，则保存
      if (this.editorVisable) {
        if (this.workItem.description !== this.oldDesc) {
          this.saveDesc()
        } else {
          this.cancelEditing()
        }
      }
    },
    priorityCheck(value) {
      if (value !== 0) {
        if (value === this.priorityOldValue) {
          this.workItem.priority = 0
          this.priorityOldValue = 0
          value = 0
        } else {
          this.priorityOldValue = value
        }
      }
      // 因为change事件，每次评分的时候都会触发，即使评分是相同的也会
      // console.log('优先级改为：', value)
      // 发请求 改优先级
      editWorkItemApi({
        id: this.workItem.id,
        priority: value
      }).then(res => {
        if (!res.success) {
          // 恢复旧值
          this.workItem.priority = this.oldPriority
          this.workItem.priorityOldValue = this.oldPriority
        } else {
          // 保存旧值
          this.oldPriority = value
          // 刷新数据
          this.$emit('refreshPlanCardData')
        }
      }, () => {
        // 这是错误时的回调，恢复旧值
        this.workItem.priority = this.oldPriority
        this.workItem.priorityOldValue = this.oldPriority
      })
    },
    riskCheck(value) {
      if (value !== 0) {
        if (value === this.riskOldValue) {
          this.workItem.risk = 0
          this.riskOldValue = 0
          value = 0
        } else {
          this.riskOldValue = value
        }
      }
      // console.log('风险等级改为：', value)
      // 发请求 改风险等级
      editWorkItemApi({
        id: this.workItem.id,
        risk: value
      }).then(res => {
        if (!res.success) {
          // 恢复旧值
          this.workItem.risk = this.oldRisk
          this.workItem.riskOldValue = this.oldRisk
        } else {
          // 保存旧值
          this.oldRisk = value
          // 刷新数据
          this.$emit('refreshPlanCardData')
        }
      }, () => {
        // 这是错误时的回调，恢复旧值
        this.workItem.risk = this.oldRisk
        this.workItem.riskOldValue = this.oldRisk
      })
    },
    workItemTitleBlur() {
      // console.log('标题改为', this.workItem.title)
      if (!this.workItem.title) {
        this.$message({
          type: 'error',
          message: '标题不能为空！',
          duration: 3000
        })
        // 当标题为空并且失去焦点时，将工作项的title旧值赋值上
        this.workItem.title = this.oldTitle
        this.$refs.titleInput.focus()
      } else {
        // 发请求，改标题
        editWorkItemApi({
          id: this.workItem.id,
          title: this.workItem.title,
          editType: 'title'
        }).then(res => {
          if (!res.success) {
            this.workItem.title = this.oldTitle
          } else {
            // 保存旧值
            this.oldTitle = this.workItem.title
            // 刷新数据
            this.$emit('refreshPlanCardData')
          }
        }, () => {
          // 这是错误时的回调，恢复旧值
          this.workItem.title = this.oldTitle
        })
      }
    },
    principalChange(value) {
      // console.log('负责人修改：', value)
      // 发请求 修改负责人
      editWorkItemApi({
        id: this.workItem.id,
        principalId: value
      }).then(res => {
        if (res.success) {
          // 保存旧值
          this.oldPrincipalId = value
          // 刷新数据
          this.$emit('refreshPlanCardData')
        } else {
          // 恢复旧值
          this.workItem.principalId = this.oldPrincipalId
        }
      }, () => {
        // 这是错误时的回调，恢复旧值
        this.workItem.principalId = this.oldPrincipalId
      })
    },
    stateChange(value) {
      // console.log('状态修改为：', value)
      // 发请求 修改状态
      editWorkItemApi({
        id: this.workItem.id,
        editType: 'status',
        status: value
      }).then(res => {
        if (!res.success) {
          // 恢复旧值
          this.workItem.status = this.oldStatus
        } else {
          // 保存旧值
          this.oldStatus = value
          // 刷新数据
          this.$emit('refreshPlanCardData')
        }
      }, () => {
        // 这是错误时的回调，恢复旧值
        this.workItem.status = this.oldStatus
      })
    },
    durationChange(value) {
      // console.log('当前开始时间为', this.workItem.startTime)
      // console.log('当前结束时间为', this.workItem.endTime)
      // 发请求 修改完成时间
      editWorkItemApi({
        id: this.workItem.id,
        editType: 'date',
        startTime: value[0],
        endTime: value[1]
      }).then(res => {
        if (!res.success) {
          // 恢复旧值
          this.duration = []
          this.duration.push(this.workItem.startTime)
          this.duration.push(this.workItem.endTime)
        } else {
          // 保存旧值
          this.workItem.startTime = value[0]
          this.workItem.endTime = value[1]
          // 刷新数据
          this.$emit('refreshPlanCardData')
        }
      }, () => {
        // 这是错误时的回调，恢复旧值
        this.duration = []
        this.duration.push(this.workItem.startTime)
        this.duration.push(this.workItem.endTime)
      })
    },
    editDesc() {
      this.editorVisable = true
      // 保存旧值
      this.oldDesc = this.workItem.description
    },
    saveDesc() {
      // console.log('描述改为：', this.workItem.description)
      // 发请求 修改描述
      editWorkItemApi({
        id: this.workItem.id,
        description: this.workItem.description
      }).then(res => {
        if (!res.success) {
          // 恢复旧值
          this.workItem.description = this.oldDesc
        } else {
          // 保存旧值
          this.oldDesc = this.workItem.description
          // 刷新数据
          this.$emit('refreshPlanCardData')
        }
      }, () => {
        // 这是错误时的回调，恢复旧值
        this.workItem.description = this.oldDesc
      })
      this.editorVisable = false
    },
    cancelEditing() {
      this.editorVisable = false
      // 恢复旧值
      this.workItem.description = this.oldDesc
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
      // console.log(file)
      // console.log(this.workItem.fileList)
      // console.log('附件预览')
      this.fileOperationVisable = true
      this.curFile = file
      if (!file.id) {
        this.curFile = file.response.data
      }
    },
    filePreview(file) {
      this.fileOperationVisable = false
      const PIC = ['png', 'jpg', 'jpeg', 'gif', 'svg']
      const fileExtension = file.name.split('.').pop().toLowerCase()
      if (PIC.includes(fileExtension)) {
        const imgList = [{ fileName: file.name, fileUrl: file.url, downloadLink: file.url }]
        this.$openBox.imgPreview({ imgList, defaultIndex: 0 })
      } else {
        // 使用kkfileview在线预览 官网链接https://file.kkview.cn 自己的服务器：http://47.120.39.20:8012
        window.open(`https://file.kkview.cn/onlinePreview?url=` + encodeURIComponent(base64Encode.encode(file.url)))
      }
    },
    handleBeforeRemove() {
      return this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    handleRemove(file, fileList) {
      // console.log(file)
      // console.log(fileList)
      this.fileIdList = []
      for (const file of fileList) {
        this.fileIdList.push(file.id)
      }
      this.editFileList(file, fileList, 'remove')
    },
    uploadSuccess(response, file, fileList) {
      this.fileIdList.push(response.data.id)
      this.editFileList(file, fileList, 'upload')
    },
    uploadError() {
      this.$message({
        type: 'error',
        message: '附件上传失败，请稍后重试！',
        duration: 3000
      })
    },
    editFileList(file, fileList, type) {
      // console.log('文件列表改为：', this.fileIdList)
      editWorkItemApi({
        id: this.workItem.id,
        fileList: this.fileIdList,
        updateFileList: 1
      }).then(res => {
        if (!res.success) {
          // 恢复旧值
          this.fileIdList = []
          if (type === 'remove') {
            fileList.push(file)
          } else if (type === 'upload') {
            const index = fileList.indexOf(file)
            fileList.splice(index, 1)
          }
          for (const file of fileList) {
            this.fileIdList.push(file.id)
          }
        } else {
          // 刷新数据
          this.$emit('refreshPlanCardData')
        }
      }, () => {
        // 这是错误时的回调，恢复旧值
        this.fileIdList = []
        if (type === 'remove') {
          fileList.push(file)
        } else if (type === 'upload') {
          const index = fileList.indexOf(file)
          fileList.splice(index, 1)
        }
        for (const file of fileList) {
          this.fileIdList.push(file.id)
        }
      })
    },
    deleteWorkItem() {
      this.$confirm('此操作将永久删除该工作项以及其所有子工作项, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { success } = await deleteWorkItemByIdApi(this.workItem.id)
        if (success) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$emit('set-visable', false)
          // 刷新数据
          this.$emit('refreshPlanCardData')
        }
      })
    }
  }
}
</script>

<style scoped>
.cp-container {
  display: flex;
  height: 520px;
}
.cp-content {
  width: 70%;
  width: 70%;
  margin-right: 10px;
  padding-right: 20px;
  overflow-x: hidden;
}
.cp-content-input .el-input{
  font-size: 20px;
}
.cp-attribute {
  width: 30%;
  margin-left: 10px;
  padding-right: 10px;
  overflow-y: hidden;
  overflow: auto;
}
.cp-attribute .basic-info div {
  margin: 15px 0;
}
.cp-attribute span {
  font-size: 14px;
  /* 让span成为行内块元素，就可以设置宽度，并且可以设置垂直居中 */
  display: inline-block;
  vertical-align: middle;
}
.basic-info-item {
  width: 120px;
}
.el-collapse {
  border: none;
}
.cp-attribute-item {
  display: flex;
  margin: 15px 0;
}
.cp-content-attribute {
  display: flex;
  margin-top: 20px;
  margin-bottom: 15px;
  font-size: 14px;
}
::v-deep .cp-desc img {
  width: 100%;
}
</style>
