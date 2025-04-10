export const PostItemProps = {
  id: Number,
  title: String,
  text: String,
  imageUrl: [String, null],
  createdAt: String,
  updatedAt: String,
  viewsCount: Number,
  onClick: Function,
  onEdit: Function,
  onDelete: Function,
};

export const SortField = ['id', 'title', 'viewsCount'];
export const SortOrder = ['asc', 'desc'];
