import { createRouter, createWebHistory } from 'vue-router';

import { PostListPage, PostItemPage, NotFoundPage } from '@/pages';

const routes = [
  { path: '/', redirect: '/posts' },
  { path: '/posts', component: PostListPage },
  { path: '/posts/:id', component: PostItemPage },
  { path: '/:pathMatch(.*)*', component: NotFoundPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
