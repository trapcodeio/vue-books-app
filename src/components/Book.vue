<script setup lang="ts">
import BookService, { Book } from "../services/book.service";
defineProps<{ book: Book }>();
</script>
<template>
  <section v-if="book" class="bg-indigo-950 p-7 text-white">
    <div class="flex space-x-5">
      <div class="cover flex-initial">
        <img src="/static/media/no-cover-img.png" class="w-[130px] h-[130px]" />
      </div>
      <div>
        <h4 class="text-2xl">Book</h4>
        <div class="about-book">
          <p><span>Title:</span> {{ book.title }}</p>
          <p><span>Description:</span> {{ book.description }}</p>
          <p>
            <span>Availability:</span>
            {{ BookService.isAvailable(book) ? "Available" : "Lent" }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cover {
  @apply bg-white px-10 rounded;
}

.about-book {
  @apply mt-2 flex flex-col space-y-1 text-sm;
}

.about-book span {
  @apply text-indigo-300 font-medium;
}
</style>
