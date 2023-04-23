<template>
  <div>
    <el-table
      :data="workItems"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      tooltip-effect="light"
      @cell-click="cellClick"
    >
      <el-table-column type="index" :width="20">
        <template slot-scope="scope">
          <div class="wil-priority" :style="{backgroundColor: (scope.row.priority ? (priorityColor[scope.row.priority] ? priorityColor[scope.row.priority] : '#73d897') : '#73d897') }" />
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
        class-name="wil-title"
      />
      <el-table-column
        prop="principal"
        label="负责人"
        :width="100"
        class-name="wil-principals"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.principal && scope.row.principal.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="截止日期"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        width="80"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.remainingTime === '0' && scope.row.endFlag === 0" type="danger">已延期</el-tag>
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
      />
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
  name: 'WorkItemList',
  props: {
    workItems: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      priorityColor: {
        1: '#73d897',
        2: '#6698ff',
        3: '#f6c659',
        4: '#ff9f73',
        5: '#ff7575'
      }
    }
  },
  methods: {
    cellClick(row, column, cell, event) {}
  }
}
</script>

<style scoped>
::v-deep .el-table td, .el-table th {
  padding: 0;
  height: 45px;
}
.wil-title input {
  outline: none;
  border: 1px solid #999999;
  padding: 5px;
  border-radius: 4px;
}
.wil-priority{
  /* background-color: #1890ff; */
  height: 45px;
  width: 4px;
}
::v-deep .wil-principals .cell {
  padding: 0;
  padding-left: 10px;
}
/* ::v-deep .principals .el-input__inner {
  border: none;
  padding: 0 30px 0 0;
} */
::v-deep .wil-title {
  cursor: pointer;
}
</style>

