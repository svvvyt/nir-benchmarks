import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router';
import { Loader } from '../components/UI';
import performanceLogger from '../utils/performanceLogger';

const PostListPage = lazy(() => import('../pages/PostListPage/PostListPage'));
const PostItemPage = lazy(() => import('../pages/PostItemPage/PostItemPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage/NotFoundPage'));

export const CustomRouter = () => {
  const location = useLocation();

  useEffect(() => {
    const stop = performanceLogger.start('RouteTransitionSpeed');
    return () => stop(); // Завершаем замер при смене маршрута
  }, [location]);

  return (
    <Suspense fallback={<Loader text='Загрузка страницы...' />}>
      <Routes>
        <Route path='/' element={<Navigate to='/posts' />} />
        <Route path='/posts' element={<PostListPage />} />
        <Route path='/posts/:id' element={<PostItemPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
