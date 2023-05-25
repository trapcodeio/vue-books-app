<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import BookService, { Book, BookForm } from "../../services/book.service";
import { useNotification } from "../../notification";
import { useRouter } from "vue-router";

const $router = useRouter();
const notification = useNotification();
const bookId = computed(() => $router.currentRoute.value.params.id as string);
const book = ref<Book | null>(null);
const isBusy = ref(false);

const form = reactive<BookForm>({
  title: "",
  description: "",
  available: true
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
    form.available = BookService.isAvailable(data);
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

  isBusy.value = true;

  try {
    await BookService.update(bookId.value, form);
    notification.notify(`Book: ${form.title} updated successfully`);
    await $router.push({ name: "books" });
  } catch (e) {
    console.error(e);
    notification.notify(`Failed to update book ${form.title}`, "error");
  } finally {
    isBusy.value = false;
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
</script>

<template>
  <div class="flex">
    <div class="box max-w-lg mx-auto w-full p-5">
      <IsBusy v-if="isBusy" class="my-32" message="Updating Book" />
      <template v-else-if="book">
        <h2 class="text-lg text-primary-800">
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

          <div class="flex item-center space-x-1">
            <label>Available:</label>
            <input type="checkbox" class="accent-primary-600" v-model="form.available" />
          </div>

          <div class="flex justify-center mt-5 space-x-3">
            <button type="submit" class="action-btn">Update</button>
            <button
              type="button"
              @click.prevent="deleteBook"
              class="action-btn-invert red-on-hover"
            >
              Delete
            </button>
          </div>
        </form>
      </template>
    </div>
  </div>
</template>
