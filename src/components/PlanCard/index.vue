<template>
  <div>
    <el-table
      :data="workItem"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      tooltip-effect="light"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="number"
        label="编号"
        show-overflow-tooltip
        :min-width="30"
      >
        <template slot-scope="scope">
          <span style="color: #1890ff">{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        show-overflow-tooltip
      />
      <el-table-column
        prop="principals"
        label="负责人"
        show-overflow-tooltip
      />
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
      workItem: [
        {
          id: '1',
          number: '1', // 编号
          title: '特性1',
          principals: [], // 负责人
          workTime: '14', // 工时
          workType: 'Feature', // 工作项类型：Epic、Feature、Story、Task、Bug
          state: '新建' // 流程状态
        },
        {
          id: '1',
          number: '2', // 编号
          title: '特性1',
          principals: [], // 负责人
          workTime: '14', // 工时
          workType: 'Feature', // 工作项类型：Epic、Feature、Story、Task、Bug
          state: '新建' // 流程状态
        },
        {
          id: '1',
          number: '3', // 编号
          title: '特性1',
          principals: [], // 负责人
          workTime: '14', // 工时
          workType: 'Feature', // 工作项类型：Epic、Feature、Story、Task、Bug
          state: '新建' // 流程状态
        },
        {
          id: '1',
          number: '4444', // 编号
          title: '特性1',
          principals: [], // 负责人
          workTime: '14', // 工时
          workType: 'Feature', // 工作项类型：Epic、Feature、Story、Task、Bug
          state: '新建' // 流程状态
        }
      ],
      tableData: [{
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        id: 2,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        id: 3,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        children: [{
          id: 31,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          id: 32,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }]
      }, {
        id: 4,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  beforeDestroy() {
  },
  methods: {
  }
}
</script>

<style scoped>
/* 隐藏按钮 */
.edit-btn {
  display: none;
}

/* 鼠标移动到单元格上，显示按钮 */
.cell:hover .edit-btn {
  display: inline-block;
}

</style>
