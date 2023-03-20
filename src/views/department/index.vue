<template>
  <div>
    <div v-if="$route.name === 'Department'">Department</div>
    <router-view v-else />
  </div>
</template>

<script>

export default {
  name: 'Department',
  components: { },
  data() {
    return {

    }
  }
}
</script>

<style scoped>

</style>
