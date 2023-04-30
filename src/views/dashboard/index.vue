<template>
  <div class="dashboard-container">
    <el-row :gutter="10">
      <el-col :span="14">
        <el-card class="db-work-card">
          <div slot="header">
            <span>我的任务</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <div class="db-work-item">
            <el-collapse v-model="workActiveNames">
              <el-collapse-item v-if="delayedWorkItem && delayedWorkItem.length > 0" title="已延期" name="delayed">
                <template slot="title">
                  <span style="font-size: 16px;color: #333333">已延期</span>
                </template>
                <WorkItemList :work-items="delayedWorkItem" />
              </el-collapse-item>
              <el-collapse-item v-if="nearDelayWorkItem && nearDelayWorkItem.length > 0" title="即将截止" name="nearDelay">
                <template slot="title">
                  <span style="font-size: 16px;color: #333333">即将截止</span>
                </template>
                <WorkItemList :work-items="nearDelayWorkItem" />
              </el-collapse-item>
              <el-collapse-item title="工作项" name="other">
                <template slot="title">
                  <span style="font-size: 16px;color: #333333">工作项</span>
                </template>
                <WorkItemList :work-items="otherWorkItem" />
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card>
          <div slot="header">
            <span>我的日程</span>
          </div>
          <div class="db-schedule">
            <CalendarList :data="calendarCellScheduleData" :type="'schedule'" />
          </div>
        </el-card>
        <div style="margin: 10px 0" />
        <el-card>
          <div slot="header">
            <span>我的待办</span>
          </div>
          <div class="db-todo-list">
            <CalendarList :data="calendarCellTodoListData" :type="'todo'" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import WorkItemList from '@/components/WorkItemList'
import CalendarList from '@/components/CalendarList'
import { getNearDelayWorkItemApi, getDelayedWorkItemApi, getOtherWorkItemApi } from '@/api/workitem'
import { getCalendarListApi } from '@/api/calendar'

export default {
  name: 'Dashboard',
  components: { WorkItemList, CalendarList },
  data() {
    return {
      workActiveNames: ['delayed', 'nearDelay', 'other'],
      delayedWorkItem: [],
      nearDelayWorkItem: [],
      otherWorkItem: [],
      calendarData: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    calendarCellScheduleData() {
      const res = []
      // 赋值日程数据
      this.calendarData.forEach(d => {
        if (d.type === 'schedule') {
          res.push(d)
        }
      })
      // 排序
      res.sort((a, b) => {
        if (a.startTime < b.startTime) {
          return -1
        } else if (a.startTime > b.startTime) {
          return 1
        } else {
          return 0
        }
      })
      return res
    },
    calendarCellTodoListData() {
      const res = []
      // 赋值待办的数据
      this.calendarData.forEach(d => {
        if (d.type === 'todo') {
          res.push(d)
        }
      })
      // 排序
      res.sort((a, b) => {
        if (a.endTime < b.endTime) {
          return -1
        } else if (a.endTime > b.endTime) {
          return 1
        } else {
          return 0
        }
      })
      return res
    }
  },
  mounted() {
    // 获取用户已经延期的工作项
    getDelayedWorkItemApi().then(res => {
      this.delayedWorkItem = res.data
    })
    // 获取用户即将延期的工作项（截止日期小于三天）
    getNearDelayWorkItemApi().then(res => {
      this.nearDelayWorkItem = res.data
    })
    // 获取还未延期，并且截止日期大于三天，还没完成的工作项
    getOtherWorkItemApi().then(res => {
      this.otherWorkItem = res.data
    })
    // 获取日历信息
    getCalendarListApi({ home: '1' }).then(res => {
      this.calendarData = res.data
    })
  }
}
</script>

<style lang="css" scoped>
.dashboard-container {
  padding: 20px 10px;
}
.db-work-card {
  /* height: 70%; */
}
.db-work-item {
  overflow: auto;
  height: 530px;
  padding-bottom: 20px;
}
.bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
.db-schedule {
  overflow: auto;
  height: 250px;
}
.db-todo-list {
  overflow: auto;
  height: 250px;
}
</style>
