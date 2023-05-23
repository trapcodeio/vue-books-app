import { $axios } from "../axios";

export interface Book {
  id: string;
  title: string;
  description: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BookForm = Pick<Book, "title" | "description">;

class BookService {
  static getAll() {
    return $axios.get<Book[]>("/books");
  }

  static get(id: string) {
    return $axios.get<Book>(`/books/${id}`);
  }

  static create(data: BookForm) {
    return $axios.post<Book>("/books", data);
  }

  static update(data: Book, id: any) {
    return $axios.put<any>(`/books/${id}`, data);
  }

  static delete(id: any) {
    return $axios.delete<any>(`/books/${id}`);
  }

  static deleteAll() {
    return $axios.delete<any>(`/books`);
  }

  static findByTitle(title: string) {
    return $axios.get<Book[]>(`/books?title=${title}`);
  }
}

export default BookService;
