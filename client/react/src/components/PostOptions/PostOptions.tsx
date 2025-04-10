import React, { memo, useCallback } from 'react';

import { Select, Input, Button } from '../UI/index';

import { SortField, SortOrder } from '../../types';

import './PostOptions.css';

interface PostOptionsProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedSort: SortField;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  sortOrder: SortOrder;
  onOrderChange: () => void;
}

export const PostOptions: React.FC<PostOptionsProps> = memo(
  ({
    searchQuery,
    onSearchChange,
    selectedSort,
    onSortChange,
    sortOrder,
    onOrderChange,
  }) => {
    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e),
      [onSearchChange]
    );
    const handleSortChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => onSortChange(e),
      [onSortChange]
    );
    const handleOrderChange = useCallback(
      () => onOrderChange(),
      [onOrderChange]
    );

    return (
      <div className='post-options'>
        <Input
          label='Поиск по заголовку'
          placeholder='Введите текст...'
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Select
          label='Сортировать по'
          value={selectedSort}
          onChange={handleSortChange}
          options={[
            { value: 'id', label: 'ID' },
            { value: 'createdAt', label: 'Дата создания' },
            { value: 'updatedAt', label: 'Дата обновления' },
            { value: 'viewsCount', label: 'Просмотры' },
          ]}
        />
        <Button onClick={handleOrderChange}>
          {sortOrder === 'asc' ? 'По убыванию' : 'По возрастанию'}
        </Button>
      </div>
    );
  }
);
