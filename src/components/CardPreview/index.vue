<template>
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
        <div>
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
              v-model="workItem.principal"
              placeholder="请选择负责人"
              filterable
              clearable
              @change="principalChange"
            >
              <el-option
                v-for="m in members"
                :key="m.id"
                :label="m.name"
                :value="m.id"
              />
            </el-select>
          </div>
          <div style="margin-left: 10px;margin-right: 10px">
            <div style="margin-bottom: 10px;">流程状态</div>
            <el-select
              ref="stateSelect"
              v-model="workItem.state"
              filterable
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
              v-model="workItem.duration"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="durationChange"
            />
          </div>
        </div>
        <!--  -->
        <div>
          <el-tabs v-model="tabsActiveName" @tab-click="handleTabClick">
            <el-tab-pane label="基本信息" name="basicInfo">
              <div style="margin-bottom: 10px">
                <span>描述</span>
                <el-link v-if="!editorVisable" style="color: #409eff;margin-left: 20px" @click="editDesc">编辑</el-link>
                <el-link v-if="editorVisable" style="color: #409eff;margin-left: 20px" @click="saveDesc">保存</el-link>
                <el-link v-if="workItem.desc !== workItem.oldDesc" style="color: #409eff;margin-left: 20px" @click="cancelEditing">取消编辑</el-link>
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
                    v-model="workItem.desc"
                    style="height: 300px; overflow-y: hidden"
                    :default-config="editorConfig"
                    :mode="mode"
                    @onCreated="onCreated"
                  />
                </div>
              </div>
              <div v-else v-html="workItem.desc" />
            </el-tab-pane>
            <el-tab-pane label="附件" name="attachment">配置管理</el-tab-pane>
            <el-tab-pane label="子工作项" name="subWorkItem">配置管理</el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <!-- 右边 -->
      <div class="cp-attribute">
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
                <span class="basic-info-item">项目</span>
                <span>项目名称</span>
              </div>
              <div>
                <span class="basic-info-item">创建人</span>
                <span style="margin-right: 5px"><el-avatar :size="'small'" src="https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/default_user.png" /></span>
                <span>李正帆</span>
              </div>
              <div>
                <span class="basic-info-item">创建时间</span>
                <span>2023年3月27日 20:18:36</span>
              </div>
              <div>
                <span class="basic-info-item">更新人</span>
                <span style="margin-right: 5px"><el-avatar :size="'small'" src="https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/default_user.png" /></span>
                <span>李正帆</span>
              </div>
              <div>
                <span class="basic-info-item">更新时间</span>
                <span>2023年3月27日 20:18:36</span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import config from '@/config/wangEditor'
export default {
  name: 'CardPreview',
  components: { Editor, Toolbar },
  props: {
    visable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const { editorConfig, toolbarConfig } = config
    return {
      members: [{ id: '1', name: '李正帆' }, { id: '2', name: '李正帆测试1' }, { id: '3', name: '李正帆测试22222222222222222222222' }], // 团队成员
      workItemVisible: true,
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
        title: '任务111111',
        oldTitle: '',
        priority: 0,
        risk: 0,
        workType: 'Task',
        principal: '2', // 负责人
        state: '', // 状态
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        duration: [], // 完成时间，有两个值，第一个为开始时间，第二个为结束时间
        fileIdList: [], // 附件
        desc: '<h1>Hello, world!</h1>', // 描述
        oldDesc: '' // 描述的旧值，用于取消编辑时
      }
    }
  },
  computed: {
    ...mapGetters(['defaultStates', 'TaskStates', 'BugStates'])
  },
  watch: {
    visable(newVal) {
      this.workItemVisible = newVal
    }
  },
  mounted() {
    // 保存描述的旧值
    this.workItem.oldDesc = this.workItem.desc
    // 判断当前的workType，选择对应的states
    if (this.workItem.workType === 'Feature' || this.workItem.workType === 'Story') {
      this.states = this.defaultStates
    } else if (this.workItem.workType === 'Task') {
      this.states = this.TaskStates
    } else if (this.workItem.workType === 'Bug') {
      this.states = this.BugStates
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
    },
    priorityCheck(value) {
      if (value !== 0) {
        if (value === this.priorityOldValue) {
          this.workItem.priority = 0
          this.priorityOldValue = 0
        } else {
          this.priorityOldValue = value
        }
      }
      // 因为change事件，每次评分的时候都会触发，即使评分是相同的也会
      // todo 发请求 改优先级
    },
    riskCheck(value) {
      if (value !== 0) {
        if (value === this.riskOldValue) {
          this.workItem.risk = 0
          this.riskOldValue = 0
        } else {
          this.riskOldValue = value
        }
      }
      // todo 发请求 改风险等级
    },
    workItemTitleBlur() {
      console.log('标题改为', this.workItem.title)
      if (!this.workItem.title) {
        this.$message({
          type: 'error',
          message: '标题不能为空！',
          duration: 3000
        })
        // 当标题为空并且失去焦点时，将工作项的title旧值赋值上
        this.workItem.title = this.workItem.oldTitle
        this.$refs.titleInput.focus()
      } else {
        // 保存旧值
        this.workItem.oldTitle = this.workItem.title
        // todo 发请求，改标题
      }
    },
    principalChange(value) {
      console.log('负责人修改：', value)
      // todo发请求 修改负责人
    },
    stateChange(value) {
      console.log('状态修改为：', value)
      // todo发请求 修改状态
    },
    durationChange(value) {
      this.workItem.startTime = value[0]
      this.workItem.endTime = value[1]
      console.log('当前开始时间为', this.workItem.startTime)
      console.log('当前结束时间为', this.workItem.endTime)
      // todo 发请求 修改完成时间
    },
    editDesc() {
      this.editorVisable = true
      // 保存旧值
      this.workItem.oldDesc = this.workItem.desc
    },
    saveDesc() {
      console.log('描述改为：', this.workItem.desc)
      // todo发请求 修改描述

      // 保存旧值
      this.workItem.oldDesc = this.workItem.desc
      this.editorVisable = false
    },
    cancelEditing() {
      this.editorVisable = false
      // 恢复旧值
      this.workItem.desc = this.workItem.oldDesc
    },
    handleTabClick(tab, event) {
      console.log(tab, event)
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

<style scoped>
.cp-container {
  display: flex;
  height: 480px;
}
.cp-content {
  width: 70%;
  width: 70%;
  margin-right: 10px;
  padding-right: 20px;
  overflow-x: hidden;
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
</style>
