<script setup lang="ts">
import Header from "./components/Header.vue";
import { useNotification } from "./notification";

const notification = useNotification();
</script>
<template>
  <Header />
  <div class="container my-20">
    <template v-if="notification.data">
      <div class="notification" :class="{ [notification.data.type]: true }">
        <span v-text="notification.data.message" />
        <button @click.prevent="() => notification.clear()" class="px-2 hover:text-base">
          X
        </button>
      </div>
    </template>

    <router-view />
  </div>
</template>
