<template>
  <div class="page">
    <el-row type="flex" justify="space-between" style="margin-top:2%">
      <el-col :span="5" class="contain-card">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-weight:bold">用户人数</span>
            <span class="card-flag">总</span>
          </div>
          <el-row class="data-show">
            <el-col :span="5">
              <div class="icon-box">
                <i class="el-icon-s-custom"></i>
              </div>
            </el-col>
            <el-col :span="16" class="count-text" style="padding-left: 20px;">{{this.userCount}} 人

            </el-col>
            <el-col :span="2">
              <div style="font-size:20px;color: green;">
                <i class="el-icon-caret-top"></i>
              </div>
              <!-- <div style="font-size:20px;color: red;">
                <i class="el-icon-caret-bottom"></i>
              </div> -->
            </el-col>
          </el-row>
        </el-card>

      </el-col>
      <el-col :span="5" class="contain-card">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-weight:bold">消息数量</span>
            <span class="card-flag">总</span>
          </div>
          <el-row class="data-show">
            <el-col :span="5">
              <div class="icon-box">
                <i class="el-icon-s-comment"></i>
              </div>
            </el-col>
            <el-col :span="16" class="count-text" style="padding-left: 20px;">{{this.userCount}}

            </el-col>
            <el-col :span="2">
              <div style="font-size:20px;color: green;">
                <i class="el-icon-caret-top"></i>
              </div>
              <!-- <div style="font-size:20px;color: red;">
                <i class="el-icon-caret-bottom"></i>
              </div> -->
            </el-col>
          </el-row>
        </el-card>

      </el-col>
      <el-col :span="5" class="contain-card">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-weight:bold">销售额</span>
            <span class="card-flag">总</span>
          </div>
          <el-row class="data-show">
            <el-col :span="5">
              <div class="icon-box">
                <i class="el-icon-s-data"></i>
              </div>
            </el-col>
            <el-col :span="16" class="count-text" style="padding-left: 20px;">{{this.userCount}}

            </el-col>
            <el-col :span="2">
              <div style="font-size:20px;color: green;">
                <i class="el-icon-caret-top"></i>
              </div>
              <!-- <div style="font-size:20px;color: red;">
                <i class="el-icon-caret-bottom"></i>
              </div> -->
            </el-col>
          </el-row>
        </el-card>

      </el-col>
      <el-col :span="5" class="contain-card">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-weight:bold">订单量</span>
            <span class="card-flag">总</span>
          </div>
          <el-row class="data-show">
            <el-col :span="5">
              <div class="icon-box">
                <i class="el-icon-s-order"></i>
              </div>
            </el-col>
            <el-col :span="16" class="count-text" style="padding-left: 20px;">{{this.userCount}}

            </el-col>
            <el-col :span="2">
              <div style="font-size:20px;color: green;">
                <i class="el-icon-caret-top"></i>
              </div>
              <div style="font-size:20px;color: red;">
                <i class="el-icon-caret-bottom"></i>
              </div>
            </el-col>
          </el-row>
        </el-card>

      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" style="margin: 2%;">
      <el-col :span="16" class="contain-card">
        <div class="echarts-div">
          <echarts id="income-bar" :option="barOption"></echarts>
        </div>
      </el-col>
      <el-col :span="7" class="contain-card">
        <el-row>
          <div class="echarts-div">
            <echarts id="analysis-radar" :option="radarOption"></echarts>
          </div>
        </el-row>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" style="margin:2%;">
      <el-col :span="14" class="contain-card">
        <div class="echarts-div">
          <echarts id="visits-polyline" :option="LineOption"></echarts>
        </div>
      </el-col>
      <el-col :span="9" class="contain-card">
        <div class="echarts-div">
          <echarts id="visitor-type-polyline" :option="pieOption" v-if="this.pieList.length !== 0"></echarts>
          <el-empty description="今天暂无登录用户" v-if="this.pieList.length === 0"></el-empty>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import echarts from '@/components/echarts/echarts.vue'
  import logapi from '@/api/logapi/logapi'
  import user from '@/api/sys/user'
  export default {
    components: {
      echarts,
    },
    name: "Index",
    data() {
      return {
        LineList: [],
        pieList: [],
        yAxisMax: "",
        userCount: "",
        weeldAndDay: "",
      };
    },
    computed: {
      LineOption() {
        return {
          title: {
            text: '网站访问数据',
            left: 'center'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: this.LineList.map(d => d.createTime.split("T")[0])
          },
          yAxis: {
            type: 'value',
            name: '访问量',
            min: 0,
            max: this.yAxisMax > 1000 ? (this.yAxisMax + 500) : (this.yAxisMax > 100 ? (this.yAxisMax + 50) : (this
              .yAxisMax > 10 ? (this.yAxisMax + 5) : this.yAxisMax + 1)),
            position: 'left',

          },
          series: [{
            data: this.LineList.map(d => d.loginCount),
            type: 'line'
          }]
        }
      },
      pieOption() {
        return {
          title: {
            text: '网站日访客类别',
            subtext: 'Fake Data',
            left: 'center'
          },
          legend: {
            orient: 'vertical',
            right: 'right'
          },
          tooltip: {
            trigger: 'item'
          },
          series: [{
            name: '访客类别 Chart',
            type: 'pie',
            radius: [30, 120],
            center: ['50%', '50%'],
            itemStyle: {
              borderRadius: this.pieList.length
            },
            data: this.pieList.map((item) => {
              return {
                name: item.roleName,
                value: item.loginCount,
              }
            })
          }]
        }
      },
      barOption() {
        return {
          title: {
            text: '年收入情况',
            left: 'center',
          },
          legend: {
            right: 'right',
            right: 50,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          dataset: {
            dimensions: ['product', '去年', '今年', ],
            source: [{
                product: '电子产品',
                去年: 43.3,
                今年: 85.8,
              },
              {
                product: '生活用品',
                去年: 83.1,
                今年: 73.4,
              },
              {
                product: '服装衣饰',
                去年: 86.4,
                今年: 65.2,
              },
              {
                product: '办公用品',
                去年: 72.4,
                今年: 53.9,
              }
            ]
          },
          xAxis: {
            type: 'category'
          },
          yAxis: {},
          series: [{
            type: 'bar',
            itemStyle: {
              color: "#409EFF"
            },
            barWidth: '20%'
          }, {
            type: 'bar',
            itemStyle: {
              color: "#91CC75"
            },
            barWidth: '20%'
          }, ]
        }
      },
      radarOption() {
        return {
          title: {
            text: '年经营分析图',
            left: 'center',
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            bottom: '0',
            data: ['去年', '今年']
          },
          radar: {
            indicator: [{
                name: '销售额',
                max: 6500
              },
              {
                name: '收入',
                max: 16000
              },
              {
                name: '利润',
                max: 30000
              },
              {
                name: '订单量',
                max: 38000
              },
              {
                name: 'Development',
                max: 52000
              },
              {
                name: 'Marketing',
                max: 25000
              },
            ],
            axisName: {
              color: '#000'
            }

          },
          series: [{
            name: 'Budget vs spending',
            type: 'radar',
            areaStyle: {},
            symbol: 'none',
            lineStyle: {
              width: 0,
            },
            tooltip: {
              trigger: 'item'
            },
            data: [{
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: '去年',
                itemStyle: {
                  color: "#409EFF"
                }
              },
              {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: '今年',
                itemStyle: {
                  color: "#B2DB9E"
                }
              }
            ]
          }]
        }
      }


    },
    mounted() {
      if (this.$store.state.token) {
        this.getUserLoginLineList();
        this.getUserLoginPieList();
        this.getUserCount();
      }

    },
    methods: {
      //获取用户登录情况
      getUserLoginLineList() {
        logapi.getUserLoginData().then((res) => {
          this.LineList = res.data.result.data;
          var maxlist = []
          res.data.result.data.forEach(element => {
            maxlist.push(element.loginCount)
          });
          this.yAxisMax = Math.max.apply(null, maxlist)
        })
      },
      //获取访客类型分布
      getUserLoginPieList() {
        logapi.getUserLoginCategory().then((res) => {
          this.pieList = res.data.result.data;
          var list = this.pieList.map((item) => {
            return {
              name: item.roleName,
              value: item.loginCount,
            }
          })
        })
      },
      //获取用户总数
      getUserCount() {
        user.getUserCount().then((res) => {
          this.userCount = res.data.result.data;
        })
      },

    },
  };
</script>

<style scoped>
  .el-calendar>>>.el-calendar-table td.is-today {
    color: #EE3F4D;
    font-weight: bold;
  }

  .contain-card {
    margin: auto;
  }

  .box-card {
    align-self: center;
    width: 100%;
    border-radius: 20px;
  }

  .card-flag {
    float: right;
    padding: 3px 0;
    color: #fff;
    width: 12%;
    text-align: center;
    border-radius: 30%;
    background: #409EFF;
  }

  .data-show {
    display: flex;
  }

  .data-show>div.el-col {
    margin: auto
  }

  .icon-box {
    width: 50px;
    height: 50px;
    background: #ebf1f2;
    border-radius: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 30px;
    color: #409EFF;
  }

  .count-text {
    margin-left: 4%;
    font-size: 20px;
    font-weight: bold;
  }

  .echarts-div {
    border: 1px solid #E9E9EB;
    padding: 2%;
  }
</style>