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
    <div class="ab-title-name">
      个人通讯录
    </div>
    <AddressBookList
      v-loading="personAddressBookLoading"
      :data="personAddressBookData"
      enable-page
      :total="personSearch.total"
      @page-change="handlePersonPageChange"
    />
  </div>
</template>

<script>
import AddressBookList from '@/components/AddressBookList'
import { getMemberListApi, getGroupListApi } from '@/api/group'
import { getAddressBookListApi } from '@/api/addressbook'

export default {
  name: 'AddressBook',
  components: { AddressBookList },
  data() {
    return {
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
      this.$router.push({ path: '/message/chat', query: { type: 'group', contactId: data.id, name: data.name }})
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
</style>
