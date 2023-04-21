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
      :data="data"
      enable-page
      :total="personSearch.total"
      @page-change="handlePersonPageChange"
    />
  </div>
</template>

<script>
import AddressBookList from '@/components/AddressBookList'
import { getMemberListApi, getGroupListApi } from '@/api/group'
export default {
  name: 'AddressBook',
  components: { AddressBookList },
  data() {
    return {
      data: [
        {
          id: '1633362162592845826',
          name: '小明',
          avatar: 'https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/db02c8745a314524b18cbf5b9e310730.png',
          email: '142517@qq.com',
          description: '我是一个帅小伙'
        },
        {
          id: '1557662367922384897',
          name: '小明',
          avatar: 'https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/db02c8745a314524b18cbf5b9e310730.png',
          email: '142517@qq.com',
          description: '我是一个帅小伙'
        },
        {
          id: '1',
          name: '小明',
          avatar: 'https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/db02c8745a314524b18cbf5b9e310730.png',
          email: '142517@qq.com',
          description: '我是一个帅小伙'
        },
        {
          id: '1',
          name: '小明',
          avatar: 'https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/db02c8745a314524b18cbf5b9e310730.png',
          email: '142517@qq.com',
          description: '我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙'
        },
        {
          id: '1',
          name: '小明',
          avatar: 'https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/db02c8745a314524b18cbf5b9e310730.png',
          email: '142517@qq.com',
          description: '我是一个帅小伙'
        },
        {
          id: '1',
          name: '小明',
          avatar: 'https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/db02c8745a314524b18cbf5b9e310730.png',
          email: '142517@qq.com',
          description: '我是一个帅小伙'
        }
      ],
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
  },
  methods: {
    handlePersonPageChange(currentPage, pageSize) {
      this.personSearch.currentPage = currentPage
      this.personSearch.pageSize = pageSize
      console.log('当前页为=》', currentPage)
      console.log('当前页大小为=》', pageSize)
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
