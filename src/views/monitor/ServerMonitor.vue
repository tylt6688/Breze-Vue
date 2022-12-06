<template>
    <el-main>

        <div id="main" style="width: 800px; height: 600px;"></div>
        <div>{{cpuinfo}}</div>
    </el-main>

</template>

<script>
    import serverMonitor from '@/api/monitor/serverMonitor';
    import * as echarts from 'echarts';

    export default {
        name: 'ServerMonitor',
        data() {
            return {
                cpuinfo: ""
            }
        },
        mounted() {
            this.getLoginLogList();
        },
        methods: {

            // 获取CPU数据 Start
            getLoginLogList() {

                var myChart = echarts.init(document.getElementById("main"));
                var data1 = [{
                    name: "CPU",
                    value: 0,
                }];
                var option = {
                    backgroundColor: 'rgba(128,128,128,0.1)',
                    tooltip: {},
                    title: {
                        text: 'CPU占用率（%）',
                        x: 'center',
                        y: 15,
                    },
                    series: [{
                            name: '速度',
                            type: 'gauge',
                            z: 3,
                            radius: "50%",
                            center: ['50%', '55%'],
                            sartAngle: 225,
                            endAngle: -45,
                            clockwise: true,
                            min: 0,
                            max: 220,
                            splitNumber: 22,
                            data: data1,
                        },
                        // {
                        //     name: '转速',
                        //     type: 'gauge',
                        //     radius: "35%",
                        //     center: ['20%', '55%'],
                        //     sartAngle: 225,
                        //     endAngle: -45,
                        //     clockwise: true,
                        //     min: 0,
                        //     max: 7,
                        //     splitNumber: 10,
                        //     data: data1,
                        // },
                        // {
                        //     name: '油表',
                        //     type: 'gauge',
                        //     radius: "25%",
                        //     center: ['77%', '50%'],
                        //     sartAngle: 225,
                        //     endAngle: -45,
                        //     clockwise: true,
                        //     min: 0,
                        //     max: 7,
                        //     splitNumber: 10,
                        //     data: data1,
                        // }
                    ]
                };
                setInterval(function () {
                    var that = this;
                    serverMonitor.getLoginLogCpuList().then(res => {

                        that.cpuinfo = res.data.result.data;
                        console.log(typeof (that.cpuinfo), that.cpuinfo);
                    })
                    option.series[0].data[0].value = parseFloat(that.cpuinfo);
                    myChart.setOption(option, true);
                }, 2000);



            },
            // 获取CPU数据 End

        },

    }
</script>

<style scoped>

</style>