<template>
  <div class="calendar-container">
    <div class="calendar-btn">
      <el-button-group>
        <el-button type="primary" icon="el-icon-plus" size="mini">新建日程</el-button>
        <el-button type="primary" icon="el-icon-plus" size="mini">新建待办</el-button>
      </el-button-group>
    </div>
    <el-calendar>
      <template
        slot="dateCell"
        slot-scope="{date, data}"
      >
        <div class="calendar-cell" :class="data.day === now ? 'is-now-day' : ''" @click="handleCellClick(date, data)">
          <div :class="data.isSelected ? 'is-selected' : ''" style="margin-right: 5px">
            {{ data.day.split('-')[2] }}
          </div>
          <div style="overflow: hidden;">
            <div class="calendar-cell-item">
              hell12345678901234567890
            </div>
            <div>
              hell
            </div>
          </div>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'Calendar',
  data() {
    return {
      now: dayjs(new Date()).format('YYYY-MM-DD')
    }
  },
  methods: {
    handleCellClick(date, data) {
      console.log(data)
    }
  }
}
</script>

<style lang="css" scoped>
.is-selected {
  color: #1989FA;
}
.calendar-container ::v-deep.el-calendar-day {
  padding: 0;
}
.calendar-container ::v-deep.el-calendar__body {
  padding: 12px 20px 0;
}
.calendar-cell {
  display: flex;
  padding: 8px;
  height: 100%;
  width: 100%;
}
.is-now-day {
  border: 1px solid #1989FA
}
.calendar-btn {
  margin-top: 10px;
  margin-left: 20px;
}
.calendar-cell-item {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
