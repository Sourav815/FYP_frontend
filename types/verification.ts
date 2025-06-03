export interface VerificationResponse {
  data: VerificationEntry[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface VerificationEntry {
  id: number;
  documentId: string;
  Name: string;
  Role: string;
  Affiliation: string;
  Conference_Name: string;
  Year: string;
  Purpose: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
