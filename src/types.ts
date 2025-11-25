
export type User = {
  id: number | string;
  email: string;
}

export type PublicationStatus = 'draft' | 'published' | 'archived'

export type Publication = {
  id: number | string;
  title: string;
  content: string;
  status: PublicationStatus;
  created_at?: string;
  updated_at?: string;
}