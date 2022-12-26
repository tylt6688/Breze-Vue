<template>
  <div class="page">
    <el-row type="flex" justify="space-between" style="margin-top:2%">
      <el-col :span="5">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-weight:bold">网站用户量</span>
            <span
              style="float: right; padding: 3px 0;color: #fff;background: red;width: 10%;text-align: center;border-radius: 30%;">周</span>
          </div>
          <el-row>
            <el-col :span="18" style="margin-left:4%;font-size:20px;font-weight:bold;">346546</el-col>
            <el-col :span="4">
              <div style="font-size:12px">
                <span>上升</span>
              </div>
            </el-col>
          </el-row>
        </el-card>

      </el-col>
      <el-col :span="5">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-weight:bold">反馈消息量</span>
            <span
              style="float: right; padding: 3px 0;color: #fff;background: green;width: 10%;text-align: center;border-radius: 30%;">总</span>
          </div>
          <el-row>
            <el-col :span="18" style="margin-left:4%;font-size:20px;font-weight:bold;">346546</el-col>
            <el-col :span="4">
              <div style="font-size:12px">
                <span>上升</span>
              </div>
            </el-col>
          </el-row>
        </el-card>

      </el-col>
      <el-col :span="5">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-weight:bold">网站用户量</span>
            <span
              style="float: right; padding: 3px 0;color: #fff;background: red;width: 10%;text-align: center;border-radius: 30%;">周</span>
          </div>
          <el-row>
            <el-col :span="18" style="margin-left:4%;font-size:20px;font-weight:bold;">346546</el-col>
            <el-col :span="4">
              <div style="font-size:12px">
                <span>上升</span>
              </div>
            </el-col>
          </el-row>
        </el-card>

      </el-col>
      <el-col :span="5">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-weight:bold">网站用户量</span>
            <span
              style="float: right; padding: 3px 0;color: #fff;background: red;width: 10%;text-align: center;border-radius: 30%;">周</span>
          </div>
          <el-row>
            <el-col :span="18" style="margin-left:4%;font-size:20px;font-weight:bold;">346546</el-col>
            <el-col :span="4">
              <div style="font-size:12px">
                <span>上升</span>
              </div>
            </el-col>
          </el-row>
        </el-card>

      </el-col>
    </el-row>
    <el-row style="margin-top:4%;">
      <el-col :span="12">
        <echarts id="visits-polyline" :option="option1"></echarts>
      </el-col>
      <el-col :span="12">
        <echarts id="visitor-type-polyline" :option="option2"></echarts>
      </el-col>
    </el-row>
    <el-row style="margin-top:40px;">
      <el-col :span="12" :offset="1">
        <el-calendar v-model="value">
        </el-calendar>
      </el-col>
      <el-col :span="9" :offset="1">
        <el-descriptions title="联系信息" :column="3" border>
          <el-descriptions-item label="用户名" labelClassName="my-label" contentClassName="my-content">kooriookami
          </el-descriptions-item>
          <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
          <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
          <el-descriptions-item label="备注">
            <el-tag size="small">学校</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="联系地址" :contentStyle="{'text-align': 'right'}">江苏省苏州市吴中区吴中大道 1188 号
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import echarts from '@/components/echarts/echarts.vue'
  import logapi from '@/api/logapi/logapi'
  export default {
    components: {
      echarts,
    },
    name: "Index",
    data() {
      return {
        list: [],
        yAxisMax: "",
        option2: {
          title: {
            text: '网站访客类别',
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
            roseType: 'area',
            itemStyle: {
              borderRadius: 7
            },
            data: [{
                value: 40,
                name: '超级管理员'
              },
              {
                value: 38,
                name: '普通用户'
              },
              {
                value: 32,
                name: '微信用户'
              },
              {
                value: 30,
                name: '开发人员'
              },
              {
                value: 28,
                name: '普通管理员'
              },
              {
                value: 26,
                name: '二级管理员'
              },
              {
                value: 22,
                name: '访客用户'
              },
            ]
          }]
        },
        value: new Date()
      };
    },
    computed: {
      option1() {
        return {
          title: {
            text: '网站访问数据',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: this.list.map(d => d.createTime.split("T")[0])
          },
          yAxis: {
            type: 'value',
            name: '访问量',
            min: 0,
            max: this.yAxisMax > 1000 ? (this.yAxisMax+500) : (this.yAxisMax>100 ? (this.yAxisMax+50) :(this.yAxisMax>10 ? (this.yAxisMax+5) : this.yAxisMax+1)),
            position: 'left',

          },
          series: [{
            data: this.list.map(d => d.loginCount),
            type: 'line'
          }]
        }
      }
    },
    mounted() {
      this.getUserLoginLineList();
    },
    methods: {
      getUserLoginLineList() {
        logapi.getUserLoginData().then((res) => {
          console.log("loginCount", res.data.result.data)
          this.list = res.data.result.data;
          let maxlist = []
          res.data.result.data.forEach(element => {
            maxlist.push(element.loginCount)
          });
          this.yAxisMax = Math.max.apply(null, maxlist)
        })
      }
    },
  };
</script>

<style scoped>
  .el-calendar>>>.el-calendar-table td.is-today {
    color: #EE3F4D;
    font-weight: bold;
  }
   .my-label {
    background: #E1F3D8;
  }

  .my-content {
    background: #FDE2E2;
  }
</style>