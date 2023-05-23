import { $axios } from "../axios";

export interface Book {
  id: string;
  title: string;
  description: string;
  // the api for some reason returns this as available
  availabe?: boolean;
  // we want to use available instead
  available?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BookForm = Pick<Book, "title" | "description" | "available">;

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

  static update(id: string, data: BookForm) {
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

  static validate(data: BookForm) {
    const errors: string[] = [];
    if (!data.title) {
      errors.push("Title is required.");
    }
    if (!data.description) {
      errors.push("Description is required.");
    }
    return errors;
  }

  /**
   * Since the api misspells available as availabe we need to use this function
   * To check if a book is available
   * Incase the api is fixed it won't break our code
   * @param book
   */
  static isAvailable(book: Book) {
    return book.available === true || book.availabe === true;
  }
}

export default BookService;
