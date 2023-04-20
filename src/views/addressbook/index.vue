<template>
  <div>
    AddressBook
    <AddressBookList :data="data" />
  </div>
</template>

<script>
import AddressBookList from '@/components/AddressBookList'
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
      ]
    }
  }
}
</script>

<style scoped>

</style>
