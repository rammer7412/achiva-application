import type { Cheering } from "./Response";

export type SortOption = 'createdAt,DESC' | 'createdAt,ASC';

export type ApiBaseResponse<T = unknown> = {
  status?: 'success' | 'error';
  code?: number;
  message?: string;
  data?: T;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginUser = {
  id: number;
  email: string;
  nickName: string;
  birth: string;            // "2000-01-01"
  gender: 'MALE' | 'FEMALE' | string;
  categories?: string[];    // ["공부", "운동"] 등
  profileImageUrl?: string;
  createdAt: string;        // ISO
};

export interface Article {
  id: number;
  photoUrl: string;
  title: string;
  category: string;
  question: {
    question: string;
    content: string;
  }[];
  memberId: number;
  memberNickName: string;
  memberProfileUrl: string;
  backgroundColor: string;
  authorCategorySeq: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface PageResponse<T> {
  totalElements: number;
  totalPages: number;
  size: number;
  content: T[];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  pageable: {
    offset: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    unpaged: boolean;
    paged: boolean;
    pageNumber: number;
    pageSize: number;
  };
  first: boolean;
  last: boolean;
  empty: boolean;
}

export type BackgroundColor =
  | "#f9f9f9"
  | "#000000"
  | "#412A2A"
  | "#A6736F"
  | "#4B5373"
  | "#525D49";

export type PostRes = {
  id: number;
  photoUrl: string;
  title: string;
  category: string;
  question: Question[];
  memberId: number;
  memberNickName: string;
  memberProfileUrl: string;
  backgroundColor: BackgroundColor;
  authorCategorySeq: number;
  createdAt: string; // ISO 8601 datetime string
  updatedAt: string; // ISO 8601 datetime string
  cheerings?: Cheering[];
};

export type Question = {
  question: string;
  content: string;
};

export type ArticlesParams = {
  page?: number;
  size?: number;
  sort?: string | string[];
};
