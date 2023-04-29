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
                <span>待办 <span>{{ getTime(d.endTime) }} {{ d.title }}</span></span>
              </div>
              <div v-if="calendarDataMap.get(data.day).length <= 3 ? false : index === 2" :class="d.type === 'todo' ? 'calendar-color-gray' : ''">
                <span>+{{ calendarDataMap.get(data.day).length - 2 }} more</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-calendar>
    <el-dialog
      title="新建日程"
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
        <el-button type="primary" @click="confirmAddShedule">确 定</el-button>
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
      title="新建待办"
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
        <el-button type="primary" @click="confirmAddTodoList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getAllAddressBookListApi } from '@/api/addressbook'
import { mapGetters } from 'vuex'

export default {
  name: 'Calendar',
  data() {
    return {
      now: dayjs(new Date()).format('YYYY-MM-DD'),
      scheduleDialog: false,
      todoListDlalog: false,
      addressBookTransfer: false, // 选参与成员的列表dialog
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
      calendarData: [
        {
          id: '1',
          type: 'schedule', // 'schedule' or 'todo'
          startTime: '2023-04-29 12:00',
          endTime: '2023-04-29 17:12',
          title: '11',
          description: '描述描述描述描述描述描述描述描述描述描述描述',
          participants: []
        },
        {
          id: '2',
          type: 'schedule', // 'schedule' or 'todo'
          startTime: '2023-04-29 14:00',
          endTime: '2023-04-29 17:12',
          title: '日程22222',
          description: '描述描述描述描述描述描述描述描述描述描述',
          participants: []
        },
        {
          id: '3',
          type: 'todo', // 'schedule' or 'todo'
          startTime: '',
          endTime: '2023-04-29 17:11',
          title: '待办事项1',
          description: '描述描述描述描述描述描述描述描述描述描述描述描述',
          participants: []
        },
        {
          id: '4',
          type: 'todo', // 'schedule' or 'todo'
          startTime: '',
          endTime: '2023-04-29 22:11',
          title: '待办事项2',
          description: '描述描述描述描述描述描述描述描述描述描述',
          participants: []
        },
        {
          id: '5',
          type: 'todo', // 'schedule' or 'todo'
          startTime: '',
          endTime: '2023-04-28 22:11',
          title: '待办事项2',
          description: '描述描述描述描述描述描述描述描述描述描述',
          participants: []
        }
      ]
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
    }
  },
  mounted() {
    getAllAddressBookListApi().then(res => {
      this.addressBooks = res.data
      this.addressBooksMap = new Map()
      this.addressBooks.forEach(addressBook => {
        this.memberData.push({
          label: addressBook.name,
          key: addressBook.id
        })
        this.addressBooksMap.set(addressBook.id, addressBook)
      })
    }).catch(() => {})
  },
  methods: {
    handleCellClick(date, data) {
      console.log(data)
      console.log(this.calendarDataMap)
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
      this.scheduleAdd.participants = [] // 因为属性不在表单中，所以要单独初始化
      this.scheduleAdd.emailReminder = 1
    },
    confirmAddShedule() {
      this.$refs.scheduleAdd.validate((valid) => {
        if (valid) {
          console.log(this.scheduleAdd)
          // todo 发请求

          this.cancelAddShedule() // 这里调用并不是取消添加，而是初始化表单
        } else {
          return false
        }
      })
    },
    scheduleAddDialogClose() {
      this.cancelAddShedule()
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
      this.todoListAdd.emailReminder = 1 // 邮箱提醒
      this.todoListAdd.reminderTime1 = 30 // 截止时间前多少分钟提醒
      this.todoListAdd.reminderTime2 = 30 // 截止时间前多少分钟提醒
    },
    confirmAddTodoList() {
      this.$refs.todoListAdd.validate((valid) => {
        if (valid) {
          console.log(this.todoListAdd)
          // todo 发请求

          this.cancelAddTodoList() // 这里调用并不是取消添加，而是初始化表单
        } else {
          return false
        }
      })
    },
    todoListAddDialogClose() {
      this.cancelAddTodoList()
    },
    getDate(dateTime) {
      return dateTime.split(' ')[0]
    },
    getTime(dateTime) {
      return dateTime.split(' ')[1]
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
</style>
