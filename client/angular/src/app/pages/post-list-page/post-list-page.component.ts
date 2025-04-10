// /client/src/app/pages/post-list-page/post-list-page.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostItemProps, SortField, SortOrder } from '../../types';
import { ApiClientService } from '../../services/api-client.service';
import { PostFormComponent } from '../../components/post-form/post-form.component';
import { PostOptionsComponent } from '../../components/post-options/post-options.component';
import { PostListComponent } from '../../components/post-list/post-list.component';
import { LoaderComponent } from '../../components/ui/loader/loader.component';
import { ModalComponent } from '../../components/ui/modal/modal.component';
import { SortPostsPipe } from '../../pipes/sort-posts.pipe';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-post-list-page',
  standalone: true,
  imports: [
    CommonModule,
    PostFormComponent,
    PostOptionsComponent,
    PostListComponent,
    LoaderComponent,
    ModalComponent,
    SortPostsPipe,
  ],
  templateUrl: './post-list-page.component.html',
  styleUrls: ['./post-list-page.component.css'],
})
export class PostListPageComponent implements OnInit {
  postList: PostItemProps[] = [];
  isLoading = true;
  selectedSort: SortField = 'id';
  sortOrder: SortOrder = 'asc';
  searchQuery = '';
  editingPost: PostItemProps | null = null;

  constructor(
    private apiClient: ApiClientService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchPosts();
  }

  fetchPosts() {
    this.apiClient.get<PostItemProps[]>('/posts').subscribe({
      next: (data) => {
        this.postList = [...data];
        this.isLoading = false;
      },
      error: (error) => console.error('Error fetching data:', error),
      complete: () => (this.isLoading = false),
    });
  }

  handleEditPost(id: number) {
    const postToEdit = this.postList.find((post) => post.id === id);
    if (postToEdit) this.editingPost = postToEdit;
  }

  handleUpdatePost(formData: FormData) {
    this.apiClient
      .patch<PostItemProps>(`/posts/${this.editingPost?.id}`, formData)
      .subscribe({
        next: (data) => {
          this.postList = this.postList.map((post) =>
            post.id === this.editingPost?.id ? data : post
          );
          this.editingPost = null;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Ошибка при обновлении поста:', error);
        },
      });
  }

  handleCreatePost(post: {
    title: string;
    text: string;
    imageUrl?: File | null;
  }) {
    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('text', post.text);
    if (post.imageUrl) formData.append('imageUrl', post.imageUrl);

    const request = this.apiClient.post<PostItemProps>('/posts', formData);
    request.subscribe({
      next: (data) => {
        console.log('Пост создан:', data);
        this.postList = [data, ...this.postList];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Ошибка при создании поста:', error);
        console.log('Отправленные заголовки:', error.request?.headers);
      },
    });
  }

  handleDeletePost(id: number) {
    this.apiClient.delete(`/posts/${id}`).subscribe({
      next: () => {
        this.postList = this.postList.filter((post) => post.id !== id);
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error deleting post:', error),
    });
  }

  handleSearchQueryChange(newQuery: string) {
    this.searchQuery = newQuery;
    this.cdr.detectChanges();
  }

  handleSortChange(newSortField: SortField) {
    this.selectedSort = newSortField;
    this.cdr.detectChanges();
  }

  handleSortOrderChange(newSortOrder: SortOrder) {
    this.sortOrder = newSortOrder;
    this.cdr.detectChanges();
  }
}
