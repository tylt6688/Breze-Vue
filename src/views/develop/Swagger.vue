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
      url: ""
    };
  },
  mounted() {
  },
};
</script>
