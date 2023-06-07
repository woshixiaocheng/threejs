<template>
</template>

<script lang="ts">
import ThreeJs from "./index";
import { defineComponent, onMounted } from "vue";
export default defineComponent({
  name: "app",
  props: {},
  setup() {
    onMounted(() => {
      new ThreeJs();
    });
  },
});
</script>
<style scoped lang="scss"></style>

