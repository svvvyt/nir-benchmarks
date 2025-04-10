// /client/src/app/components/ui/select/select.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
  selected?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
})
export class SelectComponent {
  @Input() label?: string;
  @Input() options: Option[] = [];
  @Input() error?: string;
  @Input() ngModel!: string | number;
  @Output() ngModelChange = new EventEmitter<string | number>();
}
