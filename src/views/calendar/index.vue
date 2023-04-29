<template>
  <div class="calendar-container">
    <div class="calendar-btn">
      <el-button-group>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="openNewSchedule">新建日程</el-button>
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
    <el-dialog
      title="新建日程"
      :visible.sync="scheduleDialog"
      width="50%"
      top="5vh"
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
      addressBooks: [],
      addressBooksMap: [],
      memberData: []
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
    },
    openNewSchedule() {
      this.scheduleDialog = true
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
.calendar-schedule-dialog {
  height: 65vh;
  overflow: auto;
}
.calendar-avatar {
  height: 35px;
  width: 35px;
  border-radius: 50%;
  cursor: pointer;
  margin: 5px;
}
</style>
