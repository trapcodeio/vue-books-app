<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import BookService, { Book, BookForm } from "../../services/book.service";
import { useNotification } from "../../notification";
import { useRouter } from "vue-router";
import IsBusy from "../../components/IsBusy.vue";

const $router = useRouter();
const notification = useNotification();
const bookId = computed(() => $router.currentRoute.value.params.id as string);
const book = ref<Book | null>(null);
const isBusy = ref(false);

const form = reactive<BookForm>({
  title: "",
  description: ""
});

const formErrors = ref<string[]>([]);

// Fetch Book on component mount
onMounted(fetchBook);

// Fetch Book
async function fetchBook() {
  isBusy.value = true;

  try {
    const { data } = await BookService.get(bookId.value);
    book.value = data;

    // populate form
    form.title = data.title;
    form.description = data.description;
  } catch (e) {
    console.error(e);
    notification.notify(`Failed to fetch book ${bookId.value}`, "error");
  } finally {
    isBusy.value = false;
  }
}

// update book
async function updateBook() {
  formErrors.value = BookService.validate(form);
  if (formErrors.value.length) return;

  try {
    await BookService.update(bookId.value, form);
    notification.notify(`Book: ${form.title} added successfully`);
    await $router.push({ name: "books" });
  } catch (e) {
    console.error(e);
    notification.notify(`Failed to add book ${form.title}`, "error");
  }
}

// delete book
async function deleteBook() {
  if (!confirm(`Are you sure you want to delete ${book.value?.title}`)) return;

  try {
    await BookService.delete(bookId.value);
    notification.notify(`Book: ${book.value?.title} deleted successfully`);
    await $router.push({ name: "books" });
  } catch (e) {
    console.error(e);
    notification.notify(`Failed to delete book ${book.value?.title}`, "error");
  }
}

// return book
async function returnBook() {
  if (!confirm(`Are you sure you want to return ${book.value?.title}`)) return;

  try {
    await BookService.update(bookId.value, {
      ...form,
      available: true
    });

    notification.notify(`Book: ${book.value?.title} returned successfully`);
    await $router.push({ name: "books" });
  } catch (e) {
    console.error(e);
    notification.notify(`Failed to return book ${book.value?.title}`, "error");
  }
}
</script>

<template>
  <div class="flex">
    <div class="box max-w-lg mx-auto w-full p-5">
      <IsBusy v-if="isBusy" />
      <template v-else-if="book">
        <h2 class="text-lg text-indigo-800">
          <span class="text-gray-500 mr-2">Edit Book:</span>
          <b>{{ book.title }}</b>
        </h2>

        <div class="mt-5 text-red-600 text-sm" v-if="formErrors.length">
          <ul>
            <li v-for="error of formErrors" :key="error"><b>-</b> {{ error }}</li>
          </ul>
        </div>

        <form class="form mt-5" @submit.prevent="updateBook">
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

          <div>
            <b class="mr-1 text-gray-600">Availability:</b>
            <span>{{ BookService.isAvailable(book) ? "Lent" : "No" }}</span>
          </div>

          <div class="flex justify-center mt-5 space-x-3">
            <button @click.prevent="updateBook" type="submit" class="action-btn">
              Update
            </button>
            <button
              @click.prevent="deleteBook"
              type="submit"
              class="action-btn-invert red-on-hover"
            >
              Delete</button
            ><button
              @click.prevent="returnBook"
              type="submit"
              class="action-btn-invert blue-on-hover"
            >
              Return in Library
            </button>
          </div>
        </form>
      </template>
    </div>
  </div>
</template>