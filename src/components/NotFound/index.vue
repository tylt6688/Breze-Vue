<template>
  <div class="background-container">
    <!-- Your page content goes here -->
    <div class="content">
      <div>页面不见了！</div>
        <div>首页瞧瞧，点击<router-link to="/">这里</router-link>进入首页.</div>
    </div>
  </div>
</template>
 
<script>
export default {
  name: 'NotFound',
};
</script>
 
<style lang="less">
/* Scoped styles for the component */
 
.background-container {
  /* Adjust the path to your actual image file */
  background-image: url('../../assets/404_images/404.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0;
  padding: 0;
  height: 100vh; /* Set the height to 100% of the viewport height */
  display: flex;
  justify-content: center;
  align-items: center;
  .content {
  text-align: center;
}
}
</style>