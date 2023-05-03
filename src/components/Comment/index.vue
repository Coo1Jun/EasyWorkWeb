<template>
  <div class="comment-container">
    <div class="comment-avatar">
      <img class="comment-avatar-body" :src="comment.avatar">
    </div>
    <div>
      <div>
        <span style="margin-right: 10px">{{ comment.userName }}</span>
        <span>{{ comment.createTime }}</span>
      </div>
      <div class="comment-body-content">
        <p>{{ comment.content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Comment',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="css" scoped>
.comment-container {
  display: flex;
  min-height: 50px;
  margin-bottom: 20px;
}
.comment-avatar {
  margin-right: 12px;
}
.comment-avatar-body {
  height: 32px;
  width: 32px;
  border-radius: 50%;
  cursor: pointer;
}
.comment-body-content {
  padding: 10px 20px 5px 10px;
}
</style>
