<script setup lang="ts">
import LoadingSvg from "../svgs/loading-svg.vue";

defineProps({ message: { type: String } });
</script>
<template>
  <div class="flex flex-col justify-center">
    <LoadingSvg width="50" height="50" class="text-primary-800 mx-auto" />
    <template v-if="message">
      <h6 class="text-primary-800 text-center text-sm font-medium opacity-80 mt-1">
        {{ message }}
      </h6>
    </template>
  </div>
</template>
