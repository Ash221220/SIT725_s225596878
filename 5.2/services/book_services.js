const books = [
    {
        id: "1",
        title: "Atomic Habits",
        author: "James Clear",
        year: 2018,
        genre: "Self-Help",
        summary: "Atomic Habits explains how small daily changes can lead to remarkable results. The book focuses on building good habits, breaking bad ones, and improving personal productivity."
    },
    {
        id: "2",
        title: "The Alchemist",
        author: "Paulo Coelho",
        year: 1988,
        genre: "Fiction",
        summary: "A young shepherd named Santiago travels in search of treasure and discovers the importance of following dreams and listening to his heart."
    },
    {
        id: "3",
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        year: 2011,
        genre: "History",
        summary: "This book explores the history of humankind, from early humans to modern society, discussing culture, technology, and human evolution."
    },
    {
        id: "4",
        title: "1984",
        author: "George Orwell",
        year: 1949,
        genre: "Dystopian",
        summary: "A chilling story about a totalitarian society where the government controls every aspect of life and individuals struggle for freedom."
    },
    {
        id: "5",
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        year: 1937,
        genre: "Fantasy",
        summary: "Bilbo Baggins goes on an unexpected adventure with a group of dwarves to reclaim their homeland from a dragon."
    }
];

const getAllBooks = () => {
    return books;
};

const getBookById = (id) => {
    return books.find(book => book.id === id);
};

module.exports = {
    getAllBooks,
    getBookById
};