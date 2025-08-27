import type { PostRes } from "@/types/ApiTypes";

export type PostsData = {
  totalElements: number;
  totalPages: number;
  size: number;
  content: PostRes[];
  number: number;
  sort: Sort;
  numberOfElements: number;
  pageable: Pageable;
  first: boolean;
  last: boolean;
  empty: boolean;
};

interface Sort {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}

interface Pageable {
  offset: number;
  sort: Sort;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
}

export type Cheering = {
  id: number;
  content: string;
  cheeringCategory: string;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  articleId: number;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};