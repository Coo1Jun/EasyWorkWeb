<template>
  <div>
    <el-table
      :data="workItems"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      tooltip-effect="light"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :indent="8"
      @cell-click="cellClick"
    >
      <el-table-column type="index" :width="20">
        <template slot-scope="scope">
          <div class="priority" :style="{backgroundColor: (scope.row.priority ? (priorityColor[scope.row.priority] ? priorityColor[scope.row.priority] : '#73d897') : '#73d897') }" />
        </template>
      </el-table-column>
      <el-table-column
        prop="number"
        label="编号"
        show-overflow-tooltip
        :width="60"
        type="index"
      >
        <template slot-scope="scope">
          <span style="color: #1890ff">{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        :min-width="250"
        show-overflow-tooltip
        class-name="title"
      >
        <template slot-scope="scope">
          <input
            v-if="(scope.row.id + scope.row.title) === workItemEditor.cellId"
            ref="titleInput"
            v-model="workItemEditor.title"
            class="title-input"
            @blur="titleCellBlur"
          >
          <span v-else>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="30" class-name="edit-title-btn">
        <template slot-scope="scope">
          <el-button size="mini" class="edit-btn" icon="el-icon-edit" circle @click="editTitle(scope)" />
        </template>
      </el-table-column>
      <el-table-column
        prop="principal"
        label="负责人"
        :width="100"
        class-name="principals"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-select
            v-if="(scope.row.id + scope.column.label) === workItemEditor.cellId"
            ref="principalSelect"
            v-model="workItemEditor.principal"
            placeholder="请选择负责人"
            style="width: 100%"
            filterable
            clearable
            @change="principalChange"
            @visible-change="principalOption"
          >
            <el-option
              v-for="m in members"
              :key="m.userId"
              :label="m.name"
              :value="m.userId"
            />
          </el-select>
          <span v-else>{{ scope.row.principal && scope.row.principal.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="remainingTime"
        label="剩余时间"
        show-overflow-tooltip
        :width="80"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.remainingTime === '0'" style="color: red">{{ scope.row.remainingTime }} 天</span>
          <span v-else>{{ scope.row.remainingTime }} 天</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="manHour"
        label="估算工时"
        show-overflow-tooltip
        :width="80"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.manHour }} 天</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="workType"
        label="卡片类型"
        show-overflow-tooltip
        :width="80"
      />
      <el-table-column
        prop="status"
        label="流程状态"
        :width="80"
        class-name="state"
      >
        <template slot-scope="scope">
          <el-select
            v-if="(scope.row.id + scope.column.label) === workItemEditor.cellId"
            ref="stateSelect"
            v-model="workItemEditor.state"
            style="width: 100%"
            filterable
            @visible-change="principalOption"
            @change="stateChange"
          >
            <el-option
              v-for="(s, index) in states"
              :key="index"
              :label="s"
              :value="s"
            />
          </el-select>
          <span v-else>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <!-- 占位 使table不太靠近右边 -->
      <el-table-column :width="30">
        <template>
          <span />
        </template>
      </el-table-column>
    </el-table>
    <CardPreview :visable="workItemVisible" :work-item-preview="curWorkItemPreview" :cur-project="curProject" @set-visable="setWorkItemVisible" />
  </div>
</template>

<script>
import CardPreview from '@/components/CardPreview'
import { mapGetters } from 'vuex'
import { getWorkItemTreeApi } from '@/api/workitem'
import { getMemberListByGroupIdApi } from '@/api/group'

export default {
  name: 'PlanCard',
  components: { CardPreview },
  props: {
    curProject: {
      type: Object,
      required: true
    },
    curEpic: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      workItemVisible: false,
      members: [], // 团队成员
      states: [],
      curWorkItemPreview: {},
      priorityColor: {
        1: '#73d897',
        2: '#6698ff',
        3: '#f6c659',
        4: '#ff9f73',
        5: '#ff7575'
      },
      workItemEditor: {
        cellId: '',
        title: '',
        principal: '',
        state: ''
      },
      workItems: []
    }
  },
  computed: {
    ...mapGetters(['defaultStates', 'TaskStates', 'BugStates'])
  },
  watch: {
    curEpic: {
      handler(val) {
        this.refreshData()
      },
      deep: true
    }
  },
  async mounted() {
    const treeResponse = await getWorkItemTreeApi({
      projectId: this.curProject.projectId,
      EpicId: this.curEpic.id
    })
    this.workItems = treeResponse.data
    // 根据项目组id获取用户信息列表
    getMemberListByGroupIdApi(this.curProject.groupId).then(res => {
      this.members = res.data
    })
  },
  beforeDestroy() {
  },
  methods: {
    editTitle(scope) {
      this.workItemEditor.cellId = scope.row.id + scope.row.title
      this.workItemEditor.title = scope.row.title
      this.$nextTick(() => {
        this.$refs.titleInput.focus()
      })
    },
    titleCellBlur() {
      this.workItemEditor.cellId = ''
      console.log('title修改：', this.workItemEditor.title)
      // todo 发请求
    },
    // 跳过表示不处理这次的点击事件
    cellClick(row, column, cell, event) {
      // 如果点击title的input框，则跳过
      if (cell.querySelector('.title-input')) return
      // 如果是点击title的编辑按钮，则跳过
      if (column.className === 'edit-title-btn') return
      if (column.label && column.label === '负责人') {
        this.workItemEditor.cellId = row.id + column.label
        // this.workItemEditor.principal = row.principal
        this.$nextTick(() => {
          this.$refs.principalSelect.focus()
        })
      }
      if (column.label && column.label === '流程状态') {
        if (row.workType === 'Feature' || row.workType === 'Story') {
          this.states = this.defaultStates
        } else if (row.workType === 'Task') {
          this.states = this.TaskStates
        } else if (row.workType === 'Bug') {
          this.states = this.BugStates
        }
        this.workItemEditor.cellId = row.id + column.label
        this.workItemEditor.principal = row.principal
        this.$nextTick(() => {
          this.$refs.stateSelect.focus()
        })
      }
      if (column.label && column.label === '标题') {
        console.log(row)
        console.log(column)
        this.curWorkItemPreview = JSON.parse(JSON.stringify(row))
        this.workItemVisible = true
      }
    },
    principalChange(value) {
      console.log('负责人修改：', value)
      // todo发请求

      this.workItemEditor.principal = ''
    },
    principalOption(visible) {
      // 下拉框出现/隐藏时触发,出现则为 true，隐藏则为 false
      if (!visible) {
        this.workItemEditor.cellId = ''
      }
    },
    stateChange(value) {
      console.log('状态修改为：', value)
      // todo发请求

      this.workItemEditor.state = ''
    },
    setWorkItemVisible(value) {
      this.workItemVisible = value
    },
    async refreshData() {
      const treeResponse = await getWorkItemTreeApi({
        projectId: this.curProject.projectId,
        EpicId: this.curEpic.id
      })
      this.workItems = treeResponse.data
    }
  }
}
</script>

<style scoped>
::v-deep .el-table td, .el-table th {
  padding: 0;
  height: 45px;
}
.title input {
  outline: none;
  border: 1px solid #999999;
  padding: 5px;
  border-radius: 4px;
}
.title-input {
  width: 80%;
}
.priority{
  /* background-color: #1890ff; */
  height: 45px;
  width: 4px;
}
::v-deep .edit-title-btn .cell {
  padding: 0;
}
.edit-btn {
  display: none;
}
.el-table__row:hover .edit-btn {
  display: inline-block;
}
::v-deep .principals .cell {
  padding: 0;
  padding-left: 10px;
}
/* ::v-deep .principals .el-input__inner {
  border: none;
  padding: 0 30px 0 0;
} */
::v-deep .title, ::v-deep .principals, ::v-deep .state{
  cursor: pointer;
}
</style>
