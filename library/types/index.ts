interface IBook {
    id: number;
    title: string;
    description: string;
    authors: string;
    favorite: string;
    fileCover: string;
    fileName: string;
}

abstract class BooksRepository {
    createBook(book: IBook){throw new Error("Implement method")}
    getBook(id: number): IBook {throw new Error("Implement method")}
    getBooks(){throw new Error("Implement method")}
    updateBook(id: number){throw new Error("Implement method")}
    deleteBook(id: number){throw new Error("Implement method")}
}