import React, { memo, useEffect, useCallback } from 'react';
import { FixedSizeList } from 'react-window';

import { PostItem } from '../PostItem/PostItem';

import { PostItemProps } from '../../types';

import performanceLogger from '../../utils/performanceLogger';

interface PostListProps {
  data: PostItemProps[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ITEM_HEIGHT = 690;

const Row = ({
  index,
  style,
  data,
}: {
  index: number;
  style: React.CSSProperties;
  data: {
    items: PostItemProps[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
  };
}) => {
  const { items, onEdit, onDelete } = data;
  const item = items[index];
  const handleEdit = useCallback(() => onEdit(item.id), [item.id, onEdit]);
  const handleDelete = useCallback(
    () => onDelete(item.id),
    [item.id, onDelete]
  );

  return (
    <div style={style}>
      <PostItem {...item} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export const PostList: React.FC<PostListProps> = memo(
  ({ data, onEdit, onDelete }) => {
    useEffect(() => {
      performanceLogger.measureFPS(() => {
        // Пустая функция, FPS измеряется во время прокрутки
      });
    }, []);

    return (
      <FixedSizeList
        height={1000}
        width='100%'
        itemCount={data.length}
        itemSize={ITEM_HEIGHT}
        itemData={{ items: data, onEdit, onDelete }}
      >
        {Row}
      </FixedSizeList>
    );
  }
);
