import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../ui/button/button.component';
import { ApiClientService } from '../../services/api-client.service';
import { PerformanceLoggerService } from '../../services/performance-logger.service';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css'],
})
export class PostItemComponent {
  @Input() id!: number;
  @Input() title!: string;
  @Input() text!: string;
  @Input() imageUrl?: string;
  @Input() createdAt!: string;
  @Input() updatedAt!: string;
  @Input() viewsCount!: number;
  @Output() onEdit = new EventEmitter<number>();
  @Output() onDelete = new EventEmitter<number>();

  constructor(
    private router: Router,
    private apiClient: ApiClientService,
    private performanceLogger: PerformanceLoggerService
  ) {}

  handleClick() {
    const stop = this.performanceLogger.start('EventHandlingLatency');
    this.router.navigate([`/posts/${this.id}`]);
    stop();
  }

  handleEdit() {
    const stop = this.performanceLogger.start('EventHandlingLatency');
    this.onEdit.emit(this.id);
    stop();
  }

  handleDelete() {
    const stop = this.performanceLogger.start('EventHandlingLatency');
    this.onDelete.emit(this.id);
    stop();
  }

  get fullImageUrl(): string | null {
    return this.imageUrl
      ? `${this.apiClient.getBaseURL()}${this.imageUrl}`
      : null;
  }

  handleImageError(event: Event) {
    console.error('Error loading image:', this.imageUrl);
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
