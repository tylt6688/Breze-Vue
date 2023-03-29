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
                            text: 'ECharts'
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
        directives: { // 使用局部注册指令的方式
            resize: { // 指令的名称
                bind(el, binding) { // el为绑定的元素，binding为绑定给指令的对象
                    let width = '',
                        height = '';

                    function isReize() {
                        const style = document.defaultView.getComputedStyle(el);
                        if (width !== style.width || height !== style.height) {
                            binding.value(); // 关键
                        }
                        width = style.width;
                        height = style.height;
                    }
                    el.__vueSetInterval__ = setInterval(isReize, 300);
                },
                unbind(el) {
                    clearInterval(el.__vueSetInterval__);
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
            this.adaptiveInit();
        },
        methods: {
            resize() { // 当宽高变化时就会执行
                //执行某些操作
            },
            init() {
                this.chart = echarts.init(document.getElementById(this.id));
                this.chart.setOption(this.option);

                // window.onresize = function () {
                //     this.chart.resize();
                // };
            },
            adaptiveInit() {
                setTimeout(() => {
                    this.init();
                    var resizeOb = new ResizeObserver((entries) => {
                        for (var entry of entries) {
                            echarts.getInstanceByDom(entry.target).resize();
                        }
                    });
                    resizeOb.observe(document.getElementById(this.id));
                });
            }
        },

    }
</script>