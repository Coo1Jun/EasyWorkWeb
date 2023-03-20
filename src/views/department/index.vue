<template>
  <div v-if="$route.name === 'Department'">
    Department
  </div>
  <router-view v-else />
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
