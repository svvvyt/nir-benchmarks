import React, { memo, useCallback } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '../UI';

import { PostItemProps } from '../../types';

import apiClient from '../../api/client';

import performanceLogger from '../../utils/performanceLogger';

import './PostItem.css';

export const PostItem: React.FC<PostItemProps> = memo(
  ({
    id,
    title,
    text,
    imageUrl,
    createdAt,
    updatedAt,
    viewsCount,
    onEdit,
    onDelete,
  }) => {
    const navigate = useNavigate();

    const handleClick = useCallback(() => {
      const stop = performanceLogger.start('EventHandlingLatency');
      navigate(`/posts/${id}`);
      stop();
    }, [id, navigate]);

    const handleEdit = useCallback(() => {
      const stop = performanceLogger.start('EventHandlingLatency');
      onEdit(id);
      stop();
    }, [id, onEdit]);

    const handleDelete = useCallback(() => {
      const stop = performanceLogger.start('EventHandlingLatency');
      onDelete(id);
      stop();
    }, [id, onDelete]);

    const fullImageUrl = imageUrl
      ? `${apiClient.defaults.baseURL}${imageUrl}`
      : null;

    return (
      <div className='post-item'>
        <h2 onClick={handleClick}>{title}</h2>
        <p>{text}</p>
        {imageUrl && (
          <img
            src={fullImageUrl!}
            alt={title}
            className='post-image'
            onError={(e) => {
              console.error('Error loading image:', imageUrl);
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <div className='post-meta'>
          <span>Post ID: {id}</span>
          <br />
          <span>Created at: {new Date(createdAt).toLocaleString()}</span>
          <br />
          <span>Updated at: {new Date(updatedAt).toLocaleString()}</span>
          <br />
          <span>Views count: {viewsCount}</span>
        </div>
        <div className='post-actions'>
          <Button onClick={handleEdit}>Редактировать</Button>
          <Button onClick={handleDelete}>Удалить</Button>
        </div>
      </div>
    );
  }
);
