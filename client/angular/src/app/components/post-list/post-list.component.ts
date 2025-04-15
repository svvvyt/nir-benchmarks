import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostItemProps } from '../../types/index';
import { PostItemComponent } from '../post-item/post-item.component';
import { PerformanceLoggerService } from '../../services/performance-logger.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, PostItemComponent],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  @Input() data: PostItemProps[] = [];
  @Output() onEdit = new EventEmitter<number>();
  @Output() onDelete = new EventEmitter<number>();

  private stopFPS?: () => void;

  constructor(private performanceLogger: PerformanceLoggerService) {}

  ngOnInit() {
    // Начинаем измерение FPS при прокрутке
    this.stopFPS = this.performanceLogger.measureFPS(() => {
      // Пустой callback, FPS измеряется во время анимации
    });
  }

  ngOnDestroy() {
    // Останавливаем измерение FPS при уничтожении компонента
    if (this.stopFPS) {
      this.stopFPS();
    }
  }
}
