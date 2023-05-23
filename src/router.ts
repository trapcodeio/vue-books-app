import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Books from "./views/books/index.vue";
import AddBook from "./views/books/add.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Books,
    name: "books"
  },
  {
    path: "/books/add",
    component: AddBook,
    name: "books.add"
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
