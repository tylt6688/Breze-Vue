<template>
    <div :id="id" :style="style" v-resize="resize"></div>
</template>

<script>
    import * as echarts from 'echarts';
    export default {
        name: 'charts',
        data() {
            return {
                chart: '',
            }
        },
        props: {
            id: {
                type: String,
            },
            width: {
                type: String,
                default: '100%'
            },
            height: {
                type: String,
                default: '400px'
            },
            option: {
                type: Object,
                default () {
                    return {
                        title: {
                            text: 'ECharts 入门示例'
                        },
                        tooltip: {},
                        legend: {
                            data: ['销量']
                        },
                        xAxis: {
                            type: 'category',
                            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            data: [820, 932, 901, 934, 1290, 1330, 1320],
                            type: 'line'
                        }]
                    }
                }
            }
        },
        computed: {
            style() {
                return {
                    width: this.width,
                    height: this.height,
                }
            }
        },
        watch: {
            option: {
                handler(newVal, oldVal) {
                    if (this.chart) {
                        this.chart.setOption(newVal);
                    } else {
                        this.init();
                    }
                },
                deep: true,
            }
        },
        mounted() {
            this.init();
         this.adaptiveInit();
        },
        methods: {
            init() {
                this.chart = echarts.init(document.getElementById(this.id));
                this.chart.setOption(this.option);
                window.onresize = function () {
                    this.chart.resize();
                };
            },
            adaptiveInit(){
                setTimeout(() => {
                this.init();
                const resizeOb = new ResizeObserver((entries) => {
                    for (const entry of entries) {
                        echarts.getInstanceByDom(entry.target).resize();
                    }
                });
                resizeOb.observe(document.getElementById(this.id));
            });
            }
        },

    }
</script>