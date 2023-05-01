<template>
  <div class="calendar-container">
    <div class="calendar-btn">
      <el-button-group>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="openNewSchedule">新建日程</el-button>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="openNewTodoList">新建待办</el-button>
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
            <div v-for="(d, index) in calendarDataMap.get(data.day)" :key="d.id" class="calendar-cell-item-schedule">
              <div v-if="d.type === 'schedule' && data.day === getDate(d.startTime) && (calendarDataMap.get(data.day).length <= 3 ? index <= 2 : index < 2)" :class="d.type === 'schedule' ? 'calendar-color-pink' : ''">
                <span>日程 <span>{{ getTime(d.startTime) }} {{ d.title }}</span></span>
              </div>
              <div v-if="d.type === 'todo' && data.day === getDate(d.endTime) && (calendarDataMap.get(data.day).length <= 3 ? index <= 2 : index < 2)" :class="d.type === 'todo' ? 'calendar-color-green' : ''">
                <span v-if="d.isEnd === 1">✔️</span><span>待办 <span>{{ getTime(d.endTime) }} {{ d.title }}</span></span>
              </div>
              <div v-if="calendarDataMap.get(data.day).length <= 3 ? false : index === 2" class="calendar-color-gray">
                <span>+{{ calendarDataMap.get(data.day).length - 2 }} more</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-calendar>
    <el-dialog
      :title="isScheduleEdit ? '编辑日程' : '新建日程'"
      :visible.sync="scheduleDialog"
      width="50%"
      top="5vh"
      @closed="scheduleAddDialogClose"
    >
      <div class="calendar-schedule-dialog">
        <el-form
          ref="scheduleAdd"
          label-position="top"
          label-width="80px"
          :model="scheduleAdd"
          :rules="scheduleAddRules"
        >
          <el-form-item label="标题" prop="title">
            <el-input v-model="scheduleAdd.title" placeholder="请输入日程标题" />
          </el-form-item>
          <el-form-item label="时间段" prop="duration">
            <el-date-picker
              v-model="scheduleAdd.duration"
              type="datetimerange"
              style="width: 70%"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
            <el-switch
              v-model="scheduleAdd.emailReminder"
              style="margin-left: 30px"
              :active-value="1"
              active-text="邮件提醒"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item label="参与人">
            <div>
              <el-tooltip v-for="p in nowParticipants" :key="p.id" effect="dark" :content="p.name" placement="top">
                <img class="calendar-avatar" :src="p.avatar">
              </el-tooltip>
              <el-button icon="el-icon-plus" circle style="margin-left: 5px" @click="openAddressBook" />
            </div>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="scheduleAdd.description"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 10}"
              placeholder="请输入日程描述"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddShedule">取 消</el-button>
        <el-button v-if="!isScheduleEdit" type="primary" @click="confirmAddShedule">确 定</el-button>
        <el-button v-else type="primary" @click="confirmEditSchedule">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="参与人员"
      :visible.sync="addressBookTransfer"
      top="5vh"
    >
      <el-transfer
        v-model="scheduleAdd.participants"
        filterable
        :filter-method="filterMethod"
        filter-placeholder="请输入用户名称"
        :titles="['成员列表', '已选人员']"
        :data="memberData"
      />
    </el-dialog>
    <el-dialog
      :title="isTodoListEdit ? '编辑待办' : '新建待办'"
      :visible.sync="todoListDlalog"
      width="40%"
      top="5vh"
      @closed="todoListAddDialogClose"
    >
      <div class="calendar-schedule-dialog">
        <el-form
          ref="todoListAdd"
          label-position="top"
          label-width="80px"
          :model="todoListAdd"
          :rules="todoListRules"
        >
          <el-form-item label="标题" prop="title">
            <el-input v-model="todoListAdd.title" placeholder="请输入待办标题" />
          </el-form-item>
          <el-form-item label="截止时间" prop="endTime">
            <el-date-picker
              v-model="todoListAdd.endTime"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              type="datetime"
              placeholder="选择日期时间"
            />
            <el-switch
              v-model="todoListAdd.emailReminder"
              style="margin-left: 30px"
              :active-value="1"
              active-text="邮件提醒"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item label="提醒：截止时间前">
            <el-radio v-model="todoListAdd.reminderTimeType" label="1">
              <el-select v-model="todoListAdd.reminderTime1" :disabled="todoListAdd.reminderTimeType !== '1'">
                <el-option label="0.5 小时" :value="30" />
                <el-option label="1 小时" :value="60" />
                <el-option label="1.5 小时" :value="90" />
                <el-option label="2 小时" :value="120" />
                <el-option label="2.5 小时" :value="150" />
              </el-select>
            </el-radio>
            <el-radio v-model="todoListAdd.reminderTimeType" label="2">
              <el-input-number
                v-model="todoListAdd.reminderTime2"
                :min="1"
                :max="1440"
                :disabled="todoListAdd.reminderTimeType !== '2'"
                @blur="reminderTimeBlur"
              />
              <span style="margin-left: 5px">分钟</span>
            </el-radio>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="todoListAdd.description"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 10}"
              placeholder="请输入待办描述"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddTodoList">取 消</el-button>
        <el-button v-if="!isTodoListEdit" type="primary" @click="confirmAddTodoList">确 定</el-button>
        <el-button v-else type="primary" @click="confirmEditTodoList">保 存</el-button>
      </span>
    </el-dialog>
    <div class="calendar-cell-dialog">
      <el-dialog
        :title="calendarCellTitle"
        :visible.sync="calendarCellDialog"
        width="50%"
        top="5vh"
      >
        <div class="calendar-cell-dialog-body">
          <el-tabs v-model="calendarCellActiveName" stretch>
            <el-tab-pane label="日程" name="schedule">
              <div v-if="calendarCellScheduleData.length === 0">
                暂无数据
              </div>
              <el-collapse v-else v-model="collapseScheduleActiveName" accordion>
                <el-collapse-item v-for="data in calendarCellScheduleData" :key="data.id" :title="getTime(data.startTime) + ' 【 ' + data.title + ' 】'" :name="data.id">
                  <div>
                    <div class="calendar-cell-dialog-body-item-title">
                      <span style="">{{ data.title }}</span>
                      <span style="float: right">
                        <el-button @click="editSchedule(data)">编辑</el-button>
                        <el-button type="danger" @click="deleteSchedule(data.id)">删除</el-button>
                      </span>
                    </div>
                    <div class="calendar-cell-dialog-body-item-datetime">
                      <div>
                        <div class="calendar-cell-dialog-body-item-date">{{ getDate(data.startTime) }}</div>
                        <div class="calendar-cell-dialog-body-item-time">{{ getTime(data.startTime) }}</div>
                      </div>
                      <div>
                        <div style="height: 15px" />
                        <div class="calendar-cell-dialog-body-item-time" style="margin: 0 10px"> - </div>
                      </div>
                      <div>
                        <div>
                          <div class="calendar-cell-dialog-body-item-date">{{ getDate(data.endTime) }}</div>
                          <div class="calendar-cell-dialog-body-item-time">{{ getTime(data.endTime) }}</div>
                        </div>
                      </div>
                    </div>
                    <div style="font-size: 14px;margin: 5px 0">参与人员</div>
                    <el-tooltip v-for="p in data.participants" :key="p.id" effect="dark" :content="p.name" placement="top">
                      <img class="calendar-avatar" :src="p.avatar">
                    </el-tooltip>
                    <div style="font-size: 14px;margin: 5px 0">描述</div>
                    <div v-if="data.description && data.description !== ''" style="font-size: 14px;color: #9eacc4">{{ data.description }}</div>
                    <div v-else style="font-size: 14px;color: #9eacc4;">暂无详细描述</div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="待办" name="todo">
              <div v-if="calendarCellTodoListData.length === 0">
                暂无数据
              </div>
              <el-collapse v-else v-model="collapseTodoListActiveName" accordion>
                <el-collapse-item v-for="data in calendarCellTodoListData" :key="data.id" :title="getTime(data.endTime) + ' 【 ' + (data.isEnd ? '✔️' : '') + data.title + ' 】'" :name="data.id">
                  <div>
                    <div class="calendar-cell-dialog-body-item-title"><span style="">{{ data.title }}</span>
                      <span style="float: right">
                        <el-button v-if="data.isEnd === 0" type="info" plain @click="setTodoListEnd(data,1)">标记结束</el-button>
                        <el-button v-else type="info" plain @click="setTodoListEnd(data,0)">取消标记结束</el-button>
                        <el-button @click="editTodoList(data)">编辑</el-button>
                        <el-button type="danger" @click="deleteTodoList(data.id)">删除</el-button>
                      </span>
                    </div>
                    <div style="font-size: 14px;margin: 5px 0">截止时间</div>
                    <div class="calendar-cell-dialog-body-item-time">{{ getTime(data.endTime) }}</div>
                    <div style="font-size: 14px;margin: 5px 0">
                      提醒时间：截止时间前<span> {{ data.reminderTime }} 分钟</span>
                      <span style="margin-left: 10px">
                        <span v-if="data.emailReminder === 1">已启动邮件提醒</span>
                        <span v-else>已关闭邮件提醒</span>
                      </span>
                    </div>
                    <div style="font-size: 14px;margin: 5px 0">描述</div>
                    <div v-if="data.description && data.description !== ''" style="font-size: 14px;color: #9eacc4">{{ data.description }}</div>
                    <div v-else style="font-size: 14px;color: #9eacc4;">暂无详细描述</div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getAllAddressBookListApi } from '@/api/addressbook'
import { mapGetters } from 'vuex'
import {
  getCalendarListApi,
  addScheduleApi,
  editScheduleApi,
  addTodoListApi,
  editTodoListApi,
  setTodoListEndApi,
  deleteScheduleApi,
  deleteTodoListApi
} from '@/api/calendar'

export default {
  name: 'Calendar',
  data() {
    return {
      now: dayjs(new Date()).format('YYYY-MM-DD'),
      scheduleDialog: false,
      todoListDlalog: false,
      isScheduleEdit: false,
      isTodoListEdit: false,
      addressBookTransfer: false, // 选参与成员的列表dialog
      calendarCellDialog: false,
      calendarCellActiveName: 'schedule',
      calendarCellTitle: '',
      collapseScheduleActiveName: '',
      collapseTodoListActiveName: '',
      // calendarCellScheduleData: [],
      // calendarCellTodoListData: [],
      scheduleAdd: {
        title: '',
        duration: [],
        participants: [], // 参与人
        emailReminder: 1, // 邮箱提醒
        description: ''
      },
      scheduleAddRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        duration: [
          { type: 'array', required: true, message: '请选择时间段', trigger: 'change' }
        ]
      },
      todoListAdd: {
        title: '',
        endTime: '',
        emailReminder: 1, // 邮箱提醒
        reminderTime1: 30, // 截止时间前多少分钟提醒
        reminderTime2: 30, // 截止时间前多少分钟提醒
        description: '',
        reminderTimeType: '1'
      },
      todoListRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请选择截止时间', trigger: 'change' }
        ]
      },
      addressBooks: [],
      addressBooksMap: [],
      memberData: [],
      calendarData: []
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    nowParticipants() {
      const res = []
      this.scheduleAdd.participants.forEach(data => {
        res.push(this.addressBooksMap.get(data))
      })
      return res
    },
    calendarShowData() {
      const res = []
      return res
    },
    calendarDataMap() {
      const res = new Map()
      this.calendarData.forEach(data => {
        let time
        if (data.type === 'schedule') {
          time = this.getDate(data.startTime)
        } else if (data.type === 'todo') {
          time = this.getDate(data.endTime)
        }
        let list = res.get(time)
        if (!list) {
          list = []
        }
        list.push(data)
        res.set(time, list)
      })
      return res
    },
    calendarCellScheduleData() {
      const res = []
      // 赋值日程数据
      if (this.calendarDataMap.get(this.calendarCellTitle)) {
        this.calendarDataMap.get(this.calendarCellTitle).forEach(d => {
          if (d.type === 'schedule') {
            res.push(d)
          }
        })
      }
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
      if (this.calendarDataMap.get(this.calendarCellTitle)) {
        this.calendarDataMap.get(this.calendarCellTitle).forEach(d => {
          if (d.type === 'todo') {
            res.push(d)
          }
        })
      }
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
    // 获取日历信息列表
    this.refreshData()
    // 获取用户信息列表
    getAllAddressBookListApi().then(res => {
      this.addressBooks = res.data
      this.addressBooksMap = new Map()
      this.addressBooks.forEach(addressBook => {
        this.memberData.push({
          label: addressBook.name,
          key: addressBook.id,
          disabled: addressBook.id === this.userInfo.userid
        })
        this.addressBooksMap.set(addressBook.id, addressBook)
      })
    }).catch(() => {})
    // 判断是否有路由参数，如果有，说明是由【工作台】页面跳转而来
    if (this.$route.params.date) {
      if (this.$route.params.active) {
        this.calendarCellActiveName = this.$route.params.active
      }
      this.handleCellClick(null, { day: this.$route.params.date })
    }
  },
  methods: {
    handleCellClick(date, data) {
      // console.log(data)
      // console.log(this.calendarDataMap)
      this.calendarCellTitle = data.day
      this.calendarCellDialog = true
    },
    openNewSchedule() {
      this.scheduleDialog = true
      this.scheduleAdd.participants = []
      this.scheduleAdd.participants.push(this.userInfo.userid)
    },
    filterMethod(query, item) {
      return item.label.indexOf(query) > -1
    },
    openAddressBook() {
      this.addressBookTransfer = true
    },
    cancelAddShedule() {
      this.scheduleDialog = false
      this.$refs.scheduleAdd.resetFields()
      this.scheduleAdd = {
        title: '',
        duration: [],
        participants: [], // 参与人
        emailReminder: 1, // 邮箱提醒
        description: ''
      }
    },
    confirmAddShedule() {
      this.$refs.scheduleAdd.validate(async(valid) => {
        if (valid) {
          // console.log(this.scheduleAdd)
          const res = await addScheduleApi({
            title: this.scheduleAdd.title,
            startTime: this.scheduleAdd.duration[0],
            endTime: this.scheduleAdd.duration[1],
            emailReminder: this.scheduleAdd.emailReminder,
            description: this.scheduleAdd.description,
            participants: this.scheduleAdd.participants
          })
          if (res.success) {
            this.refreshData()
            this.cancelAddShedule() // 这里调用并不是取消添加，而是初始化表单
          }
        } else {
          return false
        }
      })
    },
    scheduleAddDialogClose() {
      this.isScheduleEdit = false
      this.cancelAddShedule()
      // this.refreshData()
    },
    openNewTodoList() {
      this.todoListDlalog = true
    },
    reminderTimeBlur() {
      if (!this.todoListAdd.reminderTime2) {
        this.todoListAdd.reminderTime2 = 1
      }
    },
    cancelAddTodoList() {
      this.todoListDlalog = false
      this.$refs.todoListAdd.resetFields()
      this.todoListAdd = {
        title: '',
        endTime: '',
        emailReminder: 1, // 邮箱提醒
        reminderTime1: 30, // 截止时间前多少分钟提醒
        reminderTime2: 30, // 截止时间前多少分钟提醒
        description: '',
        reminderTimeType: '1'
      }
    },
    confirmAddTodoList() {
      this.$refs.todoListAdd.validate(async(valid) => {
        if (valid) {
          // console.log(this.todoListAdd)
          const data = {
            title: this.todoListAdd.title,
            endTime: this.todoListAdd.endTime,
            emailReminder: this.todoListAdd.emailReminder,
            description: this.todoListAdd.description
          }
          if (this.todoListAdd.reminderTimeType === '1') {
            data.reminderTime = this.todoListAdd.reminderTime1
          } else {
            data.reminderTime = this.todoListAdd.reminderTime2
          }
          const res = await addTodoListApi(data)
          if (res.success) {
            this.refreshData()
            this.cancelAddTodoList() // 这里调用并不是取消添加，而是初始化表单
          }
        } else {
          return false
        }
      })
    },
    todoListAddDialogClose() {
      this.isTodoListEdit = false
      this.cancelAddTodoList()
      // console.log(this.todoListAdd)
    },
    getDate(dateTime) {
      return dateTime.split(' ')[0]
    },
    getTime(dateTime) {
      return dateTime.split(' ')[1]
    },
    refreshData() {
      getCalendarListApi().then(res => {
        this.calendarData = res.data
      }).catch(() => {})
    },
    editSchedule(sourceData) {
      Object.assign(this.scheduleAdd, sourceData)
      this.isScheduleEdit = true
      this.scheduleDialog = true
      this.scheduleAdd.duration = []
      this.scheduleAdd.duration.push(sourceData.startTime)
      this.scheduleAdd.duration.push(sourceData.endTime)
      this.scheduleAdd.participants = []
      sourceData.participants.forEach(data => {
        this.scheduleAdd.participants.push(data.id)
      })
    },
    confirmEditSchedule() {
      this.$refs.scheduleAdd.validate(async(valid) => {
        if (valid) {
          // console.log(this.scheduleAdd)
          const res = await editScheduleApi({
            id: this.scheduleAdd.id,
            title: this.scheduleAdd.title,
            startTime: this.scheduleAdd.duration[0],
            endTime: this.scheduleAdd.duration[1],
            emailReminder: this.scheduleAdd.emailReminder,
            description: this.scheduleAdd.description,
            participants: this.scheduleAdd.participants
          })
          if (res.success) {
            this.refreshData()
            this.cancelAddShedule() // 这里调用并不是取消添加，而是初始化表单
          }
        } else {
          return false
        }
      })
    },
    editTodoList(sourceData) {
      Object.assign(this.todoListAdd, sourceData)
      this.todoListAdd.reminderTimeType = '2'
      this.todoListAdd.reminderTime2 = sourceData.reminderTime
      this.todoListAdd.reminderTime1 = 30
      // console.log(this.todoListAdd)
      this.isTodoListEdit = true
      this.todoListDlalog = true
    },
    confirmEditTodoList() {
      this.$refs.todoListAdd.validate(async(valid) => {
        if (valid) {
          // console.log(this.todoListAdd)
          const data = {
            id: this.todoListAdd.id,
            title: this.todoListAdd.title,
            endTime: this.todoListAdd.endTime,
            emailReminder: this.todoListAdd.emailReminder,
            description: this.todoListAdd.description
          }
          if (this.todoListAdd.reminderTimeType === '1') {
            data.reminderTime = this.todoListAdd.reminderTime1
          } else {
            data.reminderTime = this.todoListAdd.reminderTime2
          }
          const res = await editTodoListApi(data)
          if (res.success) {
            this.refreshData()
            this.cancelAddTodoList() // 这里调用并不是取消添加，而是初始化表单
          }
        } else {
          return false
        }
      })
    },
    setTodoListEnd(data, isEnd) {
      setTodoListEndApi({
        id: data.id,
        isEnd
      }).then(res => {
        if (res.success) {
          this.refreshData()
        }
      })
    },
    deleteSchedule(id) {
      deleteScheduleApi(id).then(res => {
        if (res.success) {
          this.refreshData()
        }
      })
    },
    deleteTodoList(id) {
      deleteTodoListApi(id).then(res => {
        if (res.success) {
          this.refreshData()
        }
      })
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
.calendar-cell-item-schedule {
  width: 100%;
  /* 不换行 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  margin: 2px 0;
}
.calendar-schedule-dialog {
  height: 65vh;
  overflow: auto;
}
.calendar-schedule-dialog .el-form-item__content .el-input-group {
  vertical-align: unset;
}
.calendar-avatar {
  height: 35px;
  width: 35px;
  border-radius: 50%;
  cursor: pointer;
  margin: 5px;
}
.calendar-color-pink {
  background-color: #fb7fb7;
  color: #2A344B;
  padding: 1px 1px;
  width: 100%;
}
.calendar-color-green {
  background-color: #73d897;
  color: #2A344B;
  width: 100%;
  padding: 1px 1px;
}
.calendar-color-gray {
  background-color: #e5e5e5;
  color: #2A344B;
  width: 100%;
  padding: 1px 1px;
}
.calendar-cell-dialog ::v-deep .el-dialog__body{
  padding: 0 20px 30px;
}
.calendar-cell-dialog-body {
  height: 75vh;
  font-size: 14px;
}
.calendar-cell-dialog-body-item-title {
  font-size: 24px;
  color: #2A344b;
}
.calendar-cell-dialog-body-item-time {
  font-size: 48px;
  color: #6698FF;
}
.calendar-cell-dialog-body ::v-deep .el-collapse-item__header {
  font-size: 16px;
}
.calendar-cell-dialog-body-item-datetime {
  display: flex;
}
.calendar-cell-dialog-body-item-date {
  color: #6698FF;
  height: 15px;
  font-size: 14px;
  margin-left: 5px;
}
</style>
