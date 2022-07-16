<template>
  <div>
    <el-dialog  @open="onOpen" @close="onClose" title="Dialog Titile">
      <el-form ref="notifyForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="请输入标题" prop="field102">
          <el-input v-model="formData.field102" placeholder="请输入请输入标题" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="请输入内容" prop="field101">
          <tinymce v-model="formData.field101" placeholder="请输入请输入内容" :height="350"></tinymce>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  components: {},
  props: [],
  data() {
    return {
      formData: {
        field102: undefined,
        field101: null,
      },
      rules: {
        field102: [{
          required: true,
          message: '请输入请输入标题',
          trigger: 'blur'
        }],
        field101: [{
          required: true,
          message: '请输入请输入内容',
          trigger: 'blur'
        }],
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onOpen() {},
    onClose() {
      this.$refs['elForm'].resetFields()
    },
    close() {
      this.$emit('update:visible', false)
    },
    handelConfirm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.close()
      })
    },
  }
}

</script>
<style>
</style>
