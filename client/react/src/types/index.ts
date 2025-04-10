export interface PostItemProps {
  id: number;
  title: string;
  text: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  viewsCount: number;
  onClick?: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export type SortField = 'id' | 'title' | 'viewsCount';
export type SortOrder = 'asc' | 'desc';
