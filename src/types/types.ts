import type { ChangeEvent, FormEvent } from 'react';

export type ProfileType = {
  username: string;
  avatarType: string;
  avatarImage: string;
  isPublic: boolean;
  id: string;
};

export type UserState = {
  token: string | null;
  id: string | null;
  email: string | null;
  password: string | null;
  isLoading: boolean;
  username: string | null;
  avatarType: string | null;
  avatarImage: string | null;
  avatarColor: string | null;
  isPublic: boolean;
};

export type BookDataType = {
  readLink: string;
  review: string;
  id?: number;
  title: string;
  authors: { name: string }[];
  download_count?: number;
  formats: {
    'image/jpeg'?: string;
    'text/html'?: string;
  };
  summaries?: string[];
};

export type BookType = {
  id: string;
  data: BookDataType;
  shelfId: string;
};

export type ShelfType = {
  id: string;
  title: string;
  bookIds: string[];
};

export type LibraryState = {
  shelves: ShelfType[];
  books: BookType[];
  selectedBook: BookType | null;
  publicLibrary: {
    shelves: ShelfType[];
    books: BookType[];
  } | null;
  ownerInfo: ProfileType | null;
};

export type FormProps = {
  loading: boolean;
  title: string;
  email: string;
  password: string;
  error: string | null;
  linkText: string;
  linkPath: string;
  linkDescription: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
};
