<template>
    <div class="block">
         <el-link href="https://love.tylt.xyz" target="_blank">
            <el-button circle>博客</el-button>
          </el-link>
          <el-link href="https://github.com/tylt6688" target="_blank">
            <el-button circle>GitHub</el-button>
          </el-link>
        <el-timeline>
            <el-timeline-item timestamp="2018/4/12" placement="top">
                <el-card>
                    <h4>进行功能完善</h4>
                    <p>tylt6688 提交于 2018/4/12 20:46</p>
                </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2018/4/3" placement="top">
                <el-card>
                    <h4>更新 Github 模板</h4>
                    <p>tylt6688 提交于 2018/4/3 20:46</p>
                </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2022/2/28" placement="top">
                <el-card>
                    <h4>创建GitHub仓库</h4>
                    <p>tylt6688 提交于 2022/2/28 20:46</p>
                </el-card>
            </el-timeline-item>
        </el-timeline>
    </div>
</template>

<script>
    export default {
        name: "About",
    }
</script>

<style>

</style>