<script setup lang="ts">
import { onMounted, ref } from "vue";
import RadioSvg from "../../svgs/radio-svg.vue";
import RadioSelectedSvg from "../../svgs/radio-selected-svg.vue";
import BookComponent from "../../components/Book.vue";
import BookService, { Book } from "../../services/book.service";
import { useNotification } from "../../notification";

const notification = useNotification();
const books = ref<Book[]>([]);
const search = ref("");
const isSearchResult = ref(false);
const isBusy = ref(false);
const selectedBook = ref<Book | null>(null);

// Fetch books on component mount
onMounted(fetchBooks);

// Check if a book is currently selected
function isActive(book: Book) {
  return selectedBook.value && selectedBook.value.id === book.id;
}

// Select a book
function selectBook(book: Book) {
  // if a book is already selected, unselect it
  if (isActive(book)) {
    selectedBook.value = null;
  } else {
    selectedBook.value = book;
  }
}

// Fetch books from API
async function fetchBooks() {
  isBusy.value = true;

  try {
    const { data } = await BookService.getAll();
    books.value = data;
    isSearchResult.value = false;
  } catch (e: any) {
    notification.notify(`Unable to fetch books: ${e.message}`, "error");
  } finally {
    isBusy.value = false;
  }
}

// delete all books
async function deleteAllBooks() {
  const shouldDelete = confirm("Are you sure you want to delete all books?");
  if (!shouldDelete) return;

  isBusy.value = true;

  try {
    await BookService.deleteAll();
    books.value = [];
  } catch (e) {
    notification.notify(`Unable to delete all books`, "error");
  } finally {
    isBusy.value = false;
  }
}

// search
async function searchBooks() {
  if (!search.value) return stopSearching();

  isBusy.value = true;
  selectedBook.value = null;

  try {
    const { data } = await BookService.findByTitle(search.value);
    books.value = data;
    isSearchResult.value = true;
  } catch (e) {
    notification.notify(`Unable to search books`, "error");
  } finally {
    isBusy.value = false;
  }
}

// stop searching
function stopSearching() {
  search.value = "";
  if (isSearchResult.value) fetchBooks();
}
</script>
<template>
  <BookComponent v-if="selectedBook" :book="selectedBook" />
  <div class="box p-8">
    <header class="grid grid-cols-2">
      <h2 class="text-2xl text-gray-800">Book List</h2>
      <div>
        <form class="search-form" @submit.prevent="searchBooks">
          <input type="text" v-model="search" placeholder="Search by title" />
          <button type="submit">Search</button>
        </form>
      </div>
    </header>
    <IsBusy v-if="isBusy" class="my-32" message="Fetching Books" />
    <template v-else-if="books.length">
      <div class="text-right text-xs my-1" v-if="isSearchResult">
        <button @click.prevent="stopSearching" class="text-red-800">
          Stop searching
        </button>
      </div>
      <section class="books">
        <template v-for="book of books" :key="book.id">
          <div
            class="book"
            :class="{ active: isActive(book) }"
            @click="() => selectBook(book)"
          >
            <div class="flex space-x-3">
              <RadioSelectedSvg
                v-if="isActive(book)"
                width="20"
                height="24"
                class="text-primary-800"
                :class="{ 'text-white': isActive(book) }"
              />
              <RadioSvg v-else width="20" height="24" class="text-primary-800" />

              <h5>{{ book.title }}</h5>
            </div>
            <div class="px-3">
              <router-link
                :to="{ name: 'books.edit', params: { id: book.id } }"
                class="text-xs font-medium bg-white rounded px-1 py-0.5 text-primary-900"
              >
                Edit
              </router-link>
            </div>
          </div>
        </template>
      </section>
      <div class="flex justify-center space-x-3 mt-12">
        <router-link :to="{ name: 'books.add' }" class="action-btn">Add Book</router-link>
        <button @click.prevent="deleteAllBooks" class="action-btn-invert red-on-hover">
          Remove All Books
        </button>
      </div>
    </template>
    <section v-else>
      <div class="flex justify-center my-14">
        <img src="/static/media/no-book.png" width="220" alt="no-book" />
      </div>
      <div class="text-center">
        <router-link :to="{ name: 'books.add' }" class="action-btn">Add Book</router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.search-form {
  @apply flex;
}

.search-form input,
.search-form button {
  @apply border border-gray-300 text-sm px-3 py-2;
}

.search-form input {
  @apply rounded-l rounded-r-none w-full;
}

.search-form button {
  @apply rounded-r text-gray-400 hover:bg-gray-600 hover:text-white;
}

.books {
  @apply my-5 cursor-pointer;
}

.book {
  @apply border border-gray-300 p-5 hover:bg-gray-200;
  @apply flex justify-between items-center;
}

.book.active {
  @apply bg-primary-900 text-white;
}

.book:first-child {
  @apply rounded-t;
}

.book:not(:last-child) {
  @apply border-b-0;
}

.book:last-child {
  @apply rounded-b;
}
</style>
