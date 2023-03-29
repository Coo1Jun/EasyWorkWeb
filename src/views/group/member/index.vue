<template>
  <div>
    GroupMember
  </div>
</template>

<script>

export default {
  name: 'GroupMember',
  components: { },
  data() {
    return {

    }
  },
  mounted() {
  },
  beforeRouteEnter(to, from, next) {
    // 当前组件需要groupId才可以渲染，如果没有，则跳转到项目组界面
    if (!to.params.id) {
      next('/console/group')
    }
    next()
  }
}
</script>

<style scoped>

</style>
