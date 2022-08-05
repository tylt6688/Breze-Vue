<template>
  <i-frame :src="url" />
</template>
<script>
  import iFrame from "@/components/iFrame/iFrame";
  export default {
    name: "Druid",
    components: {
      iFrame
    },
    data() {
      return {
        url: this.BASE_API + "/druid/login.html",
      };
    },
    mounted() {},
  };
</script>