// /client/src/app/services/api-client.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private readonly baseURL = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.baseURL}${url}`);
  }

  post<T>(url: string, body: any, options = {}): Observable<T> {
    console.log('URL запроса:', `${this.baseURL}${url}`);
    console.log('Тело запроса:', body instanceof FormData ? 'FormData' : body);
    const req = this.http.post<T>(`${this.baseURL}${url}`, body, options);
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
    return this.http.patch<T>(`${this.baseURL}${url}`, data, config);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.baseURL}${url}`);
  }

  getBaseURL(): string {
    return this.baseURL;
  }
}
