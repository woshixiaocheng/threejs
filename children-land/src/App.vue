<template>
  <div class="main">
  </div>
</template>

<script lang="ts">
import { Viewer } from "./utils";
import { defineComponent, onMounted } from "vue";
export default defineComponent({
  name: "app",
  props: {},
  setup() {
    onMounted(() => {
      console.log(Viewer)
        new Viewer();
    });
  },
});
</script>
<style scoped>
.main {
  width: 100%;
  height: 100%;
}
#webgl {
  width: 100%;
  height: 100%;
}
</style>

