import React, { memo, useState, useCallback } from 'react';

import { Button, Input } from '../index';

import './Modal.css';

interface ModalProps {
  post: {
    id: number;
    title: string;
    text: string;
    imageUrl?: string;
  };
  onUpdate: (updatedPost: FormData) => void;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = memo(
  ({ post, onUpdate, onClose }) => {
    const [title, setTitle] = useState(post.title);
    const [text, setText] = useState(post.text);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
      post.imageUrl || null
    );

    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('text', text);
        if (imageFile) {
          formData.append('imageUrl', imageFile);
        }
        onUpdate(formData);
        onClose();
      },
      [title, text, imageFile, onUpdate, onClose]
    );

    const handleFileChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setImageFile(file);
          setPreviewUrl(URL.createObjectURL(file));
        }
      },
      []
    );

    const handleClose = useCallback(() => onClose(), [onClose]);

    return (
      <div className='modal-overlay'>
        <div className='modal-content'>
          <h2>Редактировать пост</h2>
          <form onSubmit={handleSubmit}>
            <Input
              label='Заголовок'
              placeholder='Введите заголовок...'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input
              label='Текст'
              placeholder='Введите текст...'
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
            <div className='file-input'>
              <input type='file' onChange={handleFileChange} accept='image/*' />
              {previewUrl && <img src={previewUrl} alt='Preview' />}
            </div>
            <div>
              <Button type='submit'>Сохранить</Button>
              <Button type='button' onClick={handleClose}>
                Отмена
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);
