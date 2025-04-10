import React, { memo, useCallback, useState } from 'react';

import { Button, Input } from '../UI/index';

import './PostForm.css';

interface PostFormProps {
  onCreate: (post: {
    title: string;
    text: string;
    imageUrl?: File | null;
  }) => void;
}

export const PostForm: React.FC<PostFormProps> = memo(({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState<File | null>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onCreate({ title, text, imageUrl });
      setTitle('');
      setText('');
      setImageUrl(null);
    },
    [title, text, imageUrl, onCreate]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setImageUrl(e.target.files[0]);
      }
    },
    []
  );

  return (
    <form onSubmit={handleSubmit} className='post-form'>
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
      </div>
      <Button type='submit'>Создать пост</Button>
    </form>
  );
});
