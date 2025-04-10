import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, InputComponent],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() post!: {
    id: number;
    title: string;
    text: string;
    imageUrl?: string;
  };
  @Output() onUpdate = new EventEmitter<FormData>();
  @Output() onClose = new EventEmitter<void>();

  title = '';
  text = '';
  imageFile: File | null = null;
  previewUrl: string | null = null;

  ngOnInit() {
    this.title = this.post.title;
    this.text = this.post.text;
    this.previewUrl = this.post.imageUrl || null;
  }

  handleSubmit() {
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('text', this.text);
    if (this.imageFile) {
      formData.append('imageUrl', this.imageFile); // Новое изображение
    } else if (this.post.imageUrl) {
      formData.append('imageUrl', this.post.imageUrl); // Сохраняем старое, если новое не выбрано
    }
    this.onUpdate.emit(formData);
    this.onClose.emit();
  }

  handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imageFile = input.files[0];
      this.previewUrl = URL.createObjectURL(this.imageFile);
    }
  }
}
