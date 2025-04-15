import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PerformanceLoggerService } from './services/performance-logger.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'client';

  constructor(private performanceLogger: PerformanceLoggerService) {
    // Замер LoadingSpeed
    const stopLoading = this.performanceLogger.start('LoadingSpeed');
    window.addEventListener('load', () => {
      stopLoading();
    });

    // Замер TTI (примерная эмуляция)
    const stopTTI = this.performanceLogger.start('Time To Interactive');
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        stopTTI();
      }, 0); // Имитация TTI после полной загрузки DOM
    });
  }

  ngOnInit() {
    // Замер памяти при старте приложения
    this.performanceLogger.getMemoryUsage();
  }
}
