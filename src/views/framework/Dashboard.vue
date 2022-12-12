<template>
  <div class="page">
    <el-row>
      <el-col :span="4">
        <div class="data-box">
          <div class="box-content">
            <h4>本周访问量</h4>
            <h2>43566</h2>
            <div id="weekbrokenline" style="width: 600px;height:400px;display: block"></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- <div id="weekbrokenline" style="width: 600px;height:400px;"></div> -->
  </div>
</template>
<script>
  import * as echarts from 'echarts';
  export default {
    name: "Index",
    data() {
      return {

      };
    },
    mounted() {
      this.getData();
    },
    methods: {
      getData() {
        // 基于准备好的dom，初始化echarts实例
      
        var weekbrokenline = echarts.init(document.getElementById('weekbrokenline'));
        // 绘制图表
        window.onresize = function() {
    myChart.resize();
  };
        weekbrokenline.setOption({
          xAxis: {
            type: 'category',
            data: ['A', 'B', 'C'],
            show: false
          },
          yAxis: {
            type: 'value',
            show: false,
            data: [0,20,40,60]
          },
          series: [{
            data: [2, 23, 14],
            type: 'line',
          }]
        })
      },

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