<template>
  <div>
    AddressBook
    <AddressBookList />
  </div>
</template>

<script>
import AddressBookList from '@/components/AddressBookList'
export default {
  name: 'AddressBook',
  components: { AddressBookList },
  data() {
    return {

    }
  }
}
</script>

<style scoped>

</style>
