import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PerformanceLoggerService } from './performance-logger.service';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private readonly baseURL = 'https://localhost:3001';
  private cache = new Map<string, any>(); // Кэш для GET-запросов

  constructor(
    private http: HttpClient,
    private performanceLogger: PerformanceLoggerService
  ) {}

  get<T>(url: string): Observable<T> {
    const cacheKey = `${this.baseURL}${url}`;
    // Проверяем, есть ли данные в кэше
    if (this.cache.has(cacheKey)) {
      this.performanceLogger.log('APIResponseTime', 'Cache hit', false);
      return of(this.cache.get(cacheKey) as T);
    }

    const stop = this.performanceLogger.start('APIResponseTime');
    return this.http.get<T>(cacheKey).pipe(
      tap({
        next: (data) => {
          this.cache.set(cacheKey, data); // Сохраняем в кэш
          stop();
        },
        error: (err) => {
          stop();
          this.performanceLogger.logError('APIResponseTime', err);
        },
      })
    );
  }

  post<T>(url: string, body: any, options = {}): Observable<T> {
    console.log('URL запроса:', `${this.baseURL}${url}`);
    console.log('Тело запроса:', body instanceof FormData ? 'FormData' : body);
    const stop = this.performanceLogger.start('APIResponseTime');
    const req = this.http.post<T>(`${this.baseURL}${url}`, body, options).pipe(
      tap({
        next: () => stop(),
        error: (err) => {
          stop();
          this.performanceLogger.logError('APIResponseTime', err);
        },
      })
    );
    req.subscribe({
      error: (err) => console.log('Ошибка в запросе:', err.request?.headers),
    });
    return req;
  }

  patch<T>(
    url: string,
    data: any,
    config?: { headers: HttpHeaders }
  ): Observable<T> {
    const stop = this.performanceLogger.start('APIResponseTime');
    return this.http.patch<T>(`${this.baseURL}${url}`, data, config).pipe(
      tap({
        next: (data) => {
          // Инвалидируем кэш для связанного GET-запроса
          this.invalidateCache(`/posts/${this.extractIdFromUrl(url)}`);
          stop();
        },
        error: (err) => {
          stop();
          this.performanceLogger.logError('APIResponseTime', err);
        },
      })
    );
  }

  delete<T>(url: string): Observable<T> {
    const stop = this.performanceLogger.start('APIResponseTime');
    return this.http.delete<T>(`${this.baseURL}${url}`).pipe(
      tap({
        next: () => {
          // Инвалидируем кэш для связанного GET-запроса
          this.invalidateCache(`/posts/${this.extractIdFromUrl(url)}`);
          stop();
        },
        error: (err) => {
          stop();
          this.performanceLogger.logError('APIResponseTime', err);
        },
      })
    );
  }

  // Метод для инвалидации кэша
  invalidateCache(url: string): void {
    const cacheKey = `${this.baseURL}${url}`;
    this.cache.delete(cacheKey);
  }

  // Вспомогательный метод для извлечения ID из URL
  private extractIdFromUrl(url: string): string {
    const match = url.match(/\/posts\/(\d+)/);
    return match ? match[1] : '';
  }

  getBaseURL(): string {
    return this.baseURL;
  }
}
