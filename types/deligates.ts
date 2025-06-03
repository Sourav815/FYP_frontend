// /types/delegate.ts

export interface Delegate {
  id: number;
  documentId: string;
  Name: string;
  Designation: string;
  Affiliation: string;
  Role: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  Description: string | null;
  Year: string | null;
  Email: string | null;
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface Meta {
  pagination: Pagination;
}

export interface DelegatesApiResponse {
  data: Delegate[];
  meta: Meta;
}
