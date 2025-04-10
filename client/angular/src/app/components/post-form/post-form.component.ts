// /client/src/app/components/post-form/post-form.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../ui/button/button.component';
import { InputComponent } from '../ui/input/input.component';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, InputComponent],
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css'],
})
export class PostFormComponent {
  @Output() onCreate = new EventEmitter<{
    title: string;
    text: string;
    imageUrl?: File | null;
  }>();
  title = '';
  text = '';
  imageUrl: File | null = null;

  handleSubmit() {
    this.onCreate.emit({
      title: this.title,
      text: this.text,
      imageUrl: this.imageUrl,
    });
    this.title = '';
    this.text = '';
    this.imageUrl = null;
  }

  handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imageUrl = input.files[0];
    }
  }
}
