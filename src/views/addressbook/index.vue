<template>
  <div class="ab-container">
    <div class="ab-title-name">
      项目组通讯录
    </div>
    <el-collapse v-model="groupActiveName" accordion>
      <el-collapse-item v-for="g in groups" :key="g.id" :name="g.id">
        <template slot="title">
          <p style="font-size: 18px">{{ g.name }}</p>
        </template>
        <el-button round size="small" type="primary" style="margin-left: 20px" @click="toGroupChat(g)">进入群聊</el-button>
        <AddressBookList
          v-loading="groupAddressBookLoading"
          :data="groupAddressBookData"
          enable-page
          :total="groupSearch.total"
          @page-change="handleGroupPageChange"
        />
      </el-collapse-item>
    </el-collapse>
    <div style="margin: 30px 0;">
      <span class="ab-title-name">
        个人通讯录
      </span>
      <span class="ab-operation">
        <el-button type="primary" size="medium" icon="el-icon-plus" @click="findUserDialogVisible = true">添加</el-button>
      </span>
    </div>
    <AddressBookList
      v-loading="personAddressBookLoading"
      :data="personAddressBookData"
      enable-page
      :total="personSearch.total"
      @page-change="handlePersonPageChange"
    />
    <el-dialog
      title="添加好友"
      :visible.sync="findUserDialogVisible"
      width="30%"
      :modal-append-to-body="false"
    >
      <el-input
        v-model="findEmail"
        placeholder="请输入邮箱，按下回车搜索"
        clearable
        @change="findUser"
      />
      <div v-if="findUserResult" v-loading="findUserLoading" style="display: flex;margin-top: 30px">
        <div style="margin-right: 20px">
          <el-avatar :src="findUserResult.portrait" />
        </div>
        <div>
          <div style="margin-bottom: 10px">{{ findUserResult.realName }}</div>
          <div>{{ findUserResult.email }}</div>
        </div>
      </div>
      <div v-if="findUserMsg !== ''" style="margin-top: 30px">
        {{ findUserMsg }}
      </div>
      <span slot="footer" class="dialog-footer">
        <div>
          <el-button @click="cancelAddUser">取 消</el-button>
          <el-button type="primary" :disabled="!findUserResult" @click="confirmAddUser">确 定</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AddressBookList from '@/components/AddressBookList'
import { getMemberListApi, getGroupListApi } from '@/api/group'
import { getAddressBookListApi } from '@/api/addressbook'
import { getUserByEmailApi } from '@/api/user'
import { sendNotification } from '@/api/notification'
import { isUserAlreadyExistApi } from '@/api/addressbook'
import { mapGetters } from 'vuex'

export default {
  name: 'AddressBook',
  components: { AddressBookList },
  data() {
    return {
      findUserDialogVisible: false,
      findUserLoading: false,
      findEmail: '',
      findUserResult: null,
      findUserMsg: '',
      personAddressBookData: [],
      personAddressBookLoading: false,
      groupActiveName: '',
      groups: [],
      groupAddressBookData: [],
      groupAddressBookLoading: false,
      personSearch: {
        name: '',
        email: '',
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      groupSearch: {
        name: '',
        email: '',
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    groupActiveName(newVal) {
      if (newVal !== '') {
        this.handleGroupSearch()
      }
    }
  },
  async mounted() {
    // 获取项目组信息列表
    const groupResponse = await getGroupListApi()
    this.groups = groupResponse.data.records
    // 获取个人通讯录列表
    this.handlePersonSearch()
  },
  methods: {
    handlePersonPageChange(currentPage, pageSize) {
      this.personSearch.currentPage = currentPage
      this.personSearch.pageSize = pageSize
      this.handlePersonSearch()
    },
    handleGroupPageChange(currentPage, pageSize) {
      this.groupSearch.currentPage = currentPage
      this.groupSearch.pageSize = pageSize
      this.handleGroupSearch()
    },
    async handleGroupSearch() {
      this.groupAddressBookLoading = true
      const memberList = await getMemberListApi({
        groupId: this.groupActiveName,
        name: this.groupSearch.name,
        email: this.groupSearch.email,
        limit: this.groupSearch.pageSize,
        pageNo: this.groupSearch.currentPage
      })
      this.groupAddressBookData = memberList.data.records
      this.groupSearch.total = memberList.data.total
      this.groupAddressBookLoading = false
    },
    async handlePersonSearch() {
      this.personAddressBookLoading = true
      const personResponse = await getAddressBookListApi({
        name: this.personSearch.name,
        email: this.personSearch.email,
        limit: this.personSearch.pageSize,
        pageNo: this.personSearch.currentPage
      })
      this.personAddressBookData = personResponse.data.records
      this.personSearch.total = personResponse.data.total
      this.personAddressBookLoading = false
    },
    toGroupChat(data) {
      // this.$router.push({ path: '/message/chat', query: { type: 'group', contactId: data.id, name: data.name }})
      this.$router.push({ name: 'Chat', params: { type: 'group', contactId: data.id, name: data.name }})
    },
    cancelAddUser() {
      this.findUserDialogVisible = false
      this.findEmail = ''
      this.findUserResult = null
      this.findUserMsg = ''
    },
    async confirmAddUser() {
      if (this.findEmail === this.userInfo.email) {
        this.$message({
          type: 'error',
          message: '你不能添加自己到通讯录',
          duration: 3000
        })
        return
      }
      await isUserAlreadyExistApi({
        userId: this.findUserResult.id
      })
      const { success } = await sendNotification({
        userId: this.findUserResult.id,
        fromId: this.userInfo.userid,
        type: 'friend'
      })
      if (success) {
        this.$message({
          type: 'success',
          message: '已发送请求',
          duration: 3000
        })
      }
      this.findUserDialogVisible = false
      this.findEmail = ''
      this.findUserResult = null
      this.findUserMsg = ''
    },
    async findUser() {
      this.findUserLoading = true
      const { data } = await getUserByEmailApi({
        email: this.findEmail
      })
      this.findUserResult = data
      if (!data) {
        this.findUserMsg = '找不到用户'
      }
      this.findUserLoading = false
    }
  }
}
</script>

<style scoped>
.ab-container {
  padding: 0 20px 40px 20px;
}
.ab-title-name {
  font-size: 25px;
  color: #333333;
  margin: 30px 0;
}
.ab-operation {
  float: right;
}
.ab-user-radio {
  height: 90px;
}
</style>
