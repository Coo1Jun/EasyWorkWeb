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
      @cell-dblclick="cellDoubleCli"
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
            v-if="(scope.row.id + scope.column.id) === workItemEditor.cellId"
            ref="titleInput"
            v-model="workItemEditor.title"
            class="title-input"
            @blur="cellBlur"
          >
          <span v-else>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column>
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" circle @click="test(scope)" />
        </template>
      </el-table-column> -->
      <el-table-column
        prop="principals"
        label="负责人"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.principals[0] && scope.row.principals[0].name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="workTime"
        label="估算工时"
        show-overflow-tooltip
      />
      <el-table-column
        prop="workType"
        label="卡片类型"
        show-overflow-tooltip
      />
      <el-table-column
        prop="state"
        label="流程状态"
        show-overflow-tooltip
      />
      <!-- <el-table-column
        prop="date"
        label="日期"
        sortable
        width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.date }}
          <span class="cell">
            <el-button class="edit-btn" size="mini" icon="el-icon-edit" circle />
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        sortable
        width="180"
      />
      <el-table-column
        prop="address"
        label="地址"
      /> -->
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
        principals: [],
        state: ''
      },
      workItem: [
        {
          id: '1',
          number: '1111', // 编号
          title: '特性1',
          principals: [{ id: '', name: '李正帆' }], // 负责人
          workTime: '14', // 工时
          workType: 'Feature', // 工作项类型：Epic、Feature、Story、Task、Bug
          state: '新建', // 流程状态
          priority: 1,
          children: [
            {
              id: '5',
              number: '22222', // 编号
              title: '故事1',
              principals: [{ id: '', name: '李正帆' }], // 负责人
              workTime: '14', // 工时
              workType: 'Story', // 工作项类型：Epic、Feature、Story、Task、Bug
              state: '新建', // 流程状态
              priority: 2,
              children: [
                {
                  id: '8',
                  number: '11111', // 编号
                  title: '任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任任务1',
                  principals: [{ id: '', name: '李正帆' }], // 负责人
                  workTime: '14', // 工时
                  workType: 'Task', // 工作项类型：Epic、Feature、Story、Task、Bug
                  state: '新建', // 流程状态
                  priority: 3
                }
              ]
            },
            {
              id: '6',
              number: '2223', // 编号
              title: '故事3',
              principals: [], // 负责人
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
          principals: [], // 负责人
          workTime: '14', // 工时
          workType: 'Feature', // 工作项类型：Epic、Feature、Story、Task、Bug
          state: '新建', // 流程状态
          priority: 5,
          children: [
            {
              id: '7',
              number: '22', // 编号
              title: '故事4',
              principals: [], // 负责人
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
          principals: [], // 负责人
          workTime: '14', // 工时
          workType: 'Feature', // 工作项类型：Epic、Feature、Story、Task、Bug
          state: '新建' // 流程状态
        },
        {
          id: '4',
          number: '4444', // 编号
          title: '特性4',
          principals: [], // 负责人
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
    cellDoubleCli(row, column, cell, event) {
      console.log(row)
      console.log(column)
      console.log(cell)
      console.log(event)
      this.workItemEditor.cellId = row.id + column.id
      this.workItemEditor.title = row.title
      // this.$refs.titleInput.focus()
      this.$nextTick(() => {
        this.$refs.titleInput.focus()
      })
    },
    test(scope) {
      console.log(scope)
    },
    cellBlur() {
      this.workItemEditor.cellId = ''
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
</style>
