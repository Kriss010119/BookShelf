import { db } from './firebase-config';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, deleteField } from 'firebase/firestore';
import type { ShelfType, BookType } from '../types/types.ts';

export const loadLibraryFromFirebase = async (userId: string) => {
    const libraryRef = doc(db, 'libraries', userId);
    const librarySnap = await getDoc(libraryRef);

    if (librarySnap.exists()) {
        const shelves: ShelfType[] = [];
        const books: BookType[] = [];
        const data = librarySnap.data();
        if ((data.shelves) && (typeof data.shelves === 'object')) {
            Object.entries(data.shelves).forEach(([id, shelfData]) => {
                const shelf = shelfData as Omit<ShelfType, 'id'>;
                shelves.push({
                    id,
                    title: shelf.title,
                    bookIds: shelf.bookIds || []
                });
            });
        }
        if (data.books && typeof data.books === 'object') {
            Object.entries(data.books).forEach(([id, bookData]) => {
                const book = bookData as Omit<BookType, 'id'>;
                books.push({
                    id,
                    data: book.data,
                    shelfId: book.shelfId
                });
            });
        }
        return { shelves, books };
    }
    const defaultShelf: ShelfType = {
        id: `shelf_${Date.now()}`,
        title: 'My Bookshelf',
        bookIds: [],
    };
    await setDoc(libraryRef, {
        shelves: {
            [defaultShelf.id]: {
                title: defaultShelf.title,
                bookIds: []
            }
        },
        books: {}
    });
    return { shelves: [defaultShelf], books: [] };
}

export const addShelfToFirebase = async (userId: string, shelf: ShelfType) => {
    if (!shelf.id || shelf.id.trim() === '') {
        throw new Error("Invalid shelf ID");
    }
    const libraryRef = doc(db, 'libraries', userId);
    await updateDoc(libraryRef, {
        [`shelves.${shelf.id}`]: {
            title: shelf.title,
            bookIds: []
        }
    });
};

export const removeShelfFromFirebase = async (userId: string, shelfId: string) => {
    const libraryRef = doc(db, 'libraries', userId);
    const librarySnap = await getDoc(libraryRef);
    const data = librarySnap.data();

    if (data) {
        const updates: Record<string, any> = {};
        updates[`shelves.${shelfId}`] = deleteField();
        if (data.books) {
            Object.entries(data.books).forEach(([bookId, bookData]) => {
                const book = bookData as BookType;
                if (book.shelfId === shelfId) {
                    updates[`books.${bookId}`] = deleteField();
                }
            });
        }
        await updateDoc(libraryRef, updates);
    }
};

export const addBookToFirebase = async (userId: string, book: BookType) => {
    const libraryRef = doc(db, 'libraries', userId);
    await updateDoc(libraryRef, {
        [`books.${book.id}`]: {
            data: book.data,
            shelfId: book.shelfId
        },
        [`shelves.${book.shelfId}.bookIds`]: arrayUnion(book.id)
    });
};

export const removeBookFromFirebase = async (userId: string, bookId: string, shelfId: string) => {
    const libraryRef = doc(db, 'libraries', userId);
    await updateDoc(libraryRef, {
        [`books.${bookId}`]: deleteField(),
        [`shelves.${shelfId}.bookIds`]: arrayRemove(bookId)
    });
};

export const updateBookInFirebase = async (userId: string, book: BookType) => {
    const libraryRef = doc(db, 'libraries', userId);
    await updateDoc(libraryRef, {
        [`books.${book.id}`]: {
            data: book.data,
            shelfId: book.shelfId
        }
    });
};

export const getPublicUserProfile = async (userId: string) => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists() || !userSnap.data().isPublic) {
        throw new Error('Library is private or not found');
    }

    const userData = userSnap.data();
    return {
        username: userData.username,
        avatarType: userData.avatarType,
        avatarImage: userData.avatarImage,
        avatarColor: userData.avatarColor
    };
};

export const getPublicLibrary = async (userId: string) => {
    const libraryRef = doc(db, 'libraries', userId);
    const librarySnap = await getDoc(libraryRef);
    if (!librarySnap.exists()) {
        throw new Error('Library not found');
    }
    const data = librarySnap.data();
    const shelves: ShelfType[] = [];
    const books: BookType[] = [];
    if (data.shelves && typeof data.shelves === 'object') {
        Object.entries(data.shelves).forEach(([id, shelfData]) => {
            const shelf = shelfData as Omit<ShelfType, 'id'>;
            shelves.push({
                id,
                title: shelf.title,
                bookIds: shelf.bookIds || []
            });
        });
    }
    if (data.books && typeof data.books === 'object') {
        Object.entries(data.books).forEach(([id, bookData]) => {
            const book = bookData as Omit<BookType, 'id'>;
            books.push({
                id,
                data: book.data,
                shelfId: book.shelfId
            });
        });
    }
    return { shelves, books };
};