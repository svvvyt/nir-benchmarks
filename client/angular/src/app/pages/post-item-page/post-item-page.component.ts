import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostItemProps } from '../../types';
import { ApiClientService } from '../../services/api-client.service';
import { PostItemComponent } from '../../components/post-item/post-item.component';
import { LoaderComponent } from '../../components/ui/loader/loader.component';
import { ModalComponent } from '../../components/ui/modal/modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-item-page',
  standalone: true,
  imports: [CommonModule, PostItemComponent, LoaderComponent, ModalComponent],
  templateUrl: './post-item-page.component.html',
  styleUrls: ['./post-item-page.component.css'],
})
export class PostItemPageComponent implements OnInit {
  postItem: PostItemProps | null = null;
  isLoading = true;
  isEditing = false;
  id: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiClient: ApiClientService,
    private cdr: ChangeDetectorRef // Добавляем ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.apiClient.get<PostItemProps>(`/posts/${this.id}`).subscribe({
        next: (data) => {
          this.postItem = data;
          this.isLoading = false;
          this.cdr.detectChanges(); // Форсируем обновление UI после загрузки
        },
        error: (error) => console.error('Error fetching data:', error),
        complete: () => (this.isLoading = false),
      });
    }
  }

  handleUpdatePost(formData: FormData) {
    this.apiClient
      .patch<PostItemProps>(`/posts/${this.id}`, formData)
      .subscribe({
        next: (data) => {
          this.postItem = { ...data }; // Создаём новый объект для реактивности
          this.isEditing = false;
          this.cdr.detectChanges(); // Форсируем обновление UI
        },
        error: (error) => {
          console.error('Error updating post:', error);
          this.cdr.detectChanges(); // Обновляем UI даже при ошибке
        },
      });
  }

  handleDeletePost(id: number) {
    this.apiClient.delete(`/posts/${id}`).subscribe({
      error: (error) => console.error('Error deleting post:', error),
    });
  }

  onEdit() {
    this.isEditing = true;
    this.cdr.detectChanges(); // Обновляем UI при открытии редактирования
  }
}
