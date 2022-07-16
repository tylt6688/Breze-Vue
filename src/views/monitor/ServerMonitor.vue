<template>
    <el-main>
        <div>{{cpuinfo}}</div>
       
    </el-main>

</template>

<script>

    export default {
        name: 'ServerMonitor',
        data() {
            return {
                cpuinfo:""
            }
        },
        mounted() {
            this.getLoginLogList();
        },
        methods: {
      
            // 获取CPU数据 Start
            getLoginLogList() {
                this.$axios.get("/monitor/server/cpuinfo").then(res => {
                
                    this.cpuinfo = res.data.result.data;
                })
            },
            // 获取CPU数据 End

        },

    }
</script>

<style scoped>

</style>