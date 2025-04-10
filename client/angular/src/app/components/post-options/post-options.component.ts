import { ChangeDetectionStrategy } from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SortField, SortOrder } from '../../types';
import { InputComponent } from '../ui/input/input.component';
import { SelectComponent } from '../ui/select/select.component';
import { ButtonComponent } from '../ui/button/button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-post-options',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputComponent,
    SelectComponent,
    ButtonComponent,
  ],
  templateUrl: './post-options.component.html',
  styleUrls: ['./post-options.component.css'],
})
export class PostOptionsComponent {
  @Input() searchQuery = '';
  @Output() searchQueryChange = new EventEmitter<string>();
  @Input() selectedSort: SortField = 'id';
  @Output() selectedSortChange = new EventEmitter<SortField>();
  @Input() sortOrder: SortOrder = 'asc';
  @Output() sortOrderChange = new EventEmitter<SortOrder>();

  sortOptions = [
    { value: 'id', label: 'ID' },
    { value: 'createdAt', label: 'Дата создания' },
    { value: 'updatedAt', label: 'Дата обновления' },
    { value: 'viewsCount', label: 'Просмотры' },
  ];

  onSortChange(value: string) {
    this.selectedSortChange.emit(value as SortField);
  }

  toggleSortOrder() {
    const newSortOrder: SortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortOrder = newSortOrder;
    this.sortOrderChange.emit(newSortOrder);
  }
}
