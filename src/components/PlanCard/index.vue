<template>
  <div>
    <el-table
      :data="workItem"
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
              :key="m.id"
              :label="m.name"
              :value="m.id"
            />
          </el-select>
          <span v-else>{{ scope.row.principal && scope.row.principal.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="workTime"
        label="剩余时间"
        show-overflow-tooltip
        :width="80"
      />
      <el-table-column
        prop="workTime"
        label="估算工时"
        show-overflow-tooltip
        :width="80"
      />
      <el-table-column
        prop="workType"
        label="卡片类型"
        show-overflow-tooltip
        :width="80"
      />
      <el-table-column
        prop="state"
        label="流程状态"
        :width="80"
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
          <span v-else>{{ scope.row.state }}</span>
        </template>
      </el-table-column>
      <!-- 占位 使table不太靠近右边 -->
      <el-table-column :width="30">
        <template>
          <span />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'PlanCard',
  props: {

  },
  data() {
    return {
      value: '',
      members: [{ id: 1, name: '李正帆' }, { id: 2, name: '李正帆测试1' }, { id: 3, name: '李正帆测试222222' }], // 团队成员
      defaultStates: ['新建', '开发中', '已完成', '关闭'],
      taskStates: ['新建', '开发中', '已完成', '已取消'],
      BugStates: ['新建', '复现中', '进行中', '已完成', '未复现'],
      states: [],
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
      workItem: [
        {
          id: '1',
          number: '1111', // 编号
          title: '特性1',
          principal: { id: '1', name: '李正帆111111111' }, // 负责人
          workTime: '14', // 工时
          workType: 'Feature', // 工作项类型：Epic、Feature、Story、Task、Bug
          state: '新建', // 流程状态
          priority: 1,
          children: [
            {
              id: '5',
              number: '22222', // 编号
              title: '故事1',
              principal: { id: '2', name: '李正帆2' }, // 负责人
              workTime: '14', // 工时
              workType: 'Story', // 工作项类型：Epic、Feature、Story、Task、Bug
              state: '新建', // 流程状态
              priority: 2,
              children: [
                {
                  id: '8',
                  number: '11111', // 编号
                  title: '任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任务1',
                  principal: { id: '2', name: '李正帆' }, // 负责人
                  workTime: '14', // 工时
                  workType: 'Task', // 工作项类型：Epic、Feature、Story、Task、Bug
                  state: '开发中', // 流程状态
                  priority: 3
                },
                {
                  id: '9',
                  number: '11411', // 编号
                  title: '【bug】发现了问题',
                  principal: { id: '2', name: '李正帆' }, // 负责人
                  workTime: '14', // 工时
                  workType: 'Bug', // 工作项类型：Epic、Feature、Story、Task、Bug
                  state: '新建', // 流程状态
                  priority: 5
                }
              ]
            },
            {
              id: '6',
              number: '2223', // 编号
              title: '故事3',
              principal: {}, // 负责人
              workTime: '14', // 工时
              workType: 'Story', // 工作项类型：Epic、Feature、Story、Task、Bug
              state: '新建', // 流程状态
              priority: 4
            }
          ]
        },
        {
          id: '2',
          number: '2', // 编号
          title: '特性2',
          principal: {}, // 负责人
          workTime: '14', // 工时
          workType: 'Feature', // 工作项类型：Epic、Feature、Story、Task、Bug
          state: '新建', // 流程状态
          priority: 5,
          children: [
            {
              id: '7',
              number: '22', // 编号
              title: '故事4',
              principal: {}, // 负责人
              workTime: '14', // 工时
              workType: 'Story', // 工作项类型：Epic、Feature、Story、Task、Bug
              state: '新建' // 流程状态
            }
          ]
        },
        {
          id: '3',
          number: '3', // 编号
          title: '特性3',
          principal: {}, // 负责人
          workTime: '14', // 工时
          workType: 'Feature', // 工作项类型：Epic、Feature、Story、Task、Bug
          state: '新建' // 流程状态
        },
        {
          id: '4',
          number: '4444', // 编号
          title: '特性4',
          principal: {}, // 负责人
          workTime: '14', // 工时
          workType: 'Feature', // 工作项类型：Epic、Feature、Story、Task、Bug
          state: '新建' // 流程状态
        }
      ]
    }
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
    cellClick(row, column, cell, event) {
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
          this.states = this.taskStates
        } else if (row.workType === 'Bug') {
          this.states = this.BugStates
        }
        this.workItemEditor.cellId = row.id + column.label
        this.workItemEditor.principal = row.principal
        this.$nextTick(() => {
          this.$refs.stateSelect.focus()
        })
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
    }
  }
}
</script>

<style scoped>
::v-deep .el-table td, .el-table th {
  padding: 0;
  height: 45px;
}
input {
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
::v-deep .el-input__inner {
  border: none;
  padding: 0 30px 0 0;
}
</style>
