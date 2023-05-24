<script setup lang="ts">
const links = [
  { name: "Books", route: { name: "books" } },
  { name: "Add Book", route: { name: "books.add" } }
];
</script>

<template>
  <header class="navbar-dark">
    <div class="container flex justify-between">
      <router-link :to="{ name: 'books' }">
        <img src="/static/media/logo.png" class="logo" />
      </router-link>
      <ul class="flex space-x-3">
        <template v-for="link of links">
          <li>
            <router-link
              class="hover:text-white text-sm"
              :class="{
                'text-white': $route.name === link.route.name,
                'text-gray-400': $route.name !== link.route.name
              }"
              :to="link.route"
              >{{ link.name }}
            </router-link>
          </li>
        </template>
      </ul>
    </div>
  </header>
</template>
