<template>
  <i-frame :src="url" />
</template>
<script>
import iFrame from "@/components/iFrame/iFrame";
export default {
  name: "Swagger",
  components: { iFrame },
  data() {
    return {
      url: this.BASE_API+"/swagger-ui/index.html"
    };
  },
  mounted() {
  },
};
</script>
