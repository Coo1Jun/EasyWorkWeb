<template>
  <div>
    <el-table
      :data="data"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      :show-header="false"
      tooltip-effect="light"
      row-class-name="cl-row-class"
      @cell-click="cellClick"
    >
      <el-table-column
        v-if="type === 'todo'"
        prop="endTime"
        label="截止时间"
        show-overflow-tooltip
        width="140"
      />
      <el-table-column
        v-if="type === 'schedule'"
        label="时间"
        show-overflow-tooltip
        width="270"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }}<span style="margin: 0 5px">~</span>{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        :min-width="190"
        show-overflow-tooltip
        class-name="wil-title"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.isEnd === 1">✔️</span><span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <!-- 占位 使table不太靠近右边 -->
      <!-- <el-table-column :width="30">
        <template>
          <span />
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'CalendarList',
  props: {
    data: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  methods: {
    cellClick(row, column, cell, event) {
      let dateParam
      if (this.type === 'schedule') {
        dateParam = this.getDate(row.startTime)
      } else {
        dateParam = this.getDate(row.endTime)
      }
      // this.$router.push({ path: '/calendar/my', query: { date: dateParam, active: this.type }})
      this.$router.push({ name: 'MyCalendar', params: { date: dateParam, active: this.type }})
    },
    getDate(dateTime) {
      return dateTime.split(' ')[0]
    }
  }
}
</script>

<style lang="css" scoped>
::v-deep .cl-row-class {
  cursor: pointer;
}
</style>
