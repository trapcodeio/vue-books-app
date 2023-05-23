<script setup lang="ts">
import { reactive, ref } from "vue";
import BookService, { BookForm } from "../../services/book.service";
import { useNotification } from "../../notification";
import { useRouter } from "vue-router";

const $router = useRouter();
const notification = useNotification();

const form = reactive<BookForm>({
  title: "",
  description: ""
});
const formErrors = ref<string[]>([]);

// validate form
function validateForm() {
  // clear previous errors
  formErrors.value = [];

  if (!form.title) {
    formErrors.value.push("Title is required");
  }

  if (!form.description) {
    formErrors.value.push("Description is required");
  }
}

// add book
async function addBook() {
  validateForm();
  if (formErrors.value.length) return;

  try {
    await BookService.create(form);
    notification.notify(`Book: ${form.title} added successfully`);
    await $router.push({ name: "books" });
  } catch (e) {
    console.error(e);
    notification.notify(`Failed to add book ${form.title}`, "error");
  }
}
</script>

<template>
  <div class="flex">
    <div class="box max-w-lg mx-auto w-full p-5">
      <h2 class="text-lg font-bold text-indigo-900">Add Book</h2>

      <div class="mt-5 text-red-600 text-sm" v-if="formErrors.length">
        <ul>
          <li v-for="error of formErrors" :key="error"><b>-</b> {{ error }}</li>
        </ul>
      </div>

      <form class="form mt-5" @submit.prevent="addBook">
        <div>
          <label>Title</label>
          <input
            type="text"
            class="input"
            v-model="form.title"
            placeholder="Book Title"
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            cols="5"
            v-model="form.description"
            :placeholder="form.title ? `About: ${form.title}` : 'About your book...'"
          ></textarea>
        </div>

        <div class="text-center mt-5">
          <button @click.prevent="addBook" type="submit" class="action-btn">
            Add Book
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
