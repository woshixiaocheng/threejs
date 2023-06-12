<template>
  <div id="container"></div>
</template>

<script lang="ts">
import ThreeJs from "./index";
import { defineComponent, onMounted } from "vue";
export default defineComponent({
  name: "app",
  props: {},
  setup() {
    onMounted(() => {
      if(document.getElementById('container')){
        new ThreeJs(document.getElementById('container') as any);
      }
      
    });
  },
});
</script>
<style scoped lang="scss"></style>

