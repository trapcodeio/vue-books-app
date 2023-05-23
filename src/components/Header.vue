<script setup lang="ts">
const links = [
  { name: "Books", route: { name: "books" } },
  { name: "Add Book", route: { name: "books.add" } }
];
</script>

<template>
  <header class="navbar-dark">
    <div class="container flex justify-between">
      <img src="/static/media/logo.png" class="logo">
      <ul class="flex space-x-3">
        <template v-for="link of links">
          <li>
            <router-link class="text-gray-500 hover:text-white text-sm" :to="link.route">{{ link.name }}</router-link>
          </li>
        </template>
      </ul>
    </div>
  </header>
</template>
