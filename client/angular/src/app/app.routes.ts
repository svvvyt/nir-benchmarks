// /client/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { PostListPageComponent } from './pages/post-list-page/post-list-page.component';
import { PostItemPageComponent } from './pages/post-item-page/post-item-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/posts', pathMatch: 'full' },
  { path: 'posts', component: PostListPageComponent },
  { path: 'posts/:id', component: PostItemPageComponent },
  { path: '**', component: NotFoundPageComponent },
];
