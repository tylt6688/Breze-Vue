<template>
  <div class="page">
<!-- 我要用echars做仪表盘 都删了  放到那个单独的项目里面了 -->
  </div>
</template>

<script>
  export default {
    name: "Index",
    data() {
      return {
        // 分页请求数据
        size: 4,
        current: 1,

        // 回显数据数组
        banners: [],
        notify: [],
        news: [],
        presence: [],
        thought: [],
      };
    },
    mounted() {
    
    },
    methods: {
    },
  };
</script>

<style scoped>
  .el-carousel__item img {
    color: #475669;
    font-size: 16px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }

  .box-card {
    width: auto;
  }

  .item-title {
    /* width: 65%; */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
  }
</style>