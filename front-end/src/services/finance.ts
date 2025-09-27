import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private apiUrl = 'http://localhost:5000/api'; // backend URL

  constructor(private http: HttpClient) {}

  // GET /finances/:userId/:year
  getUserFinances(userId: number, year: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/finances/${userId}/${year}`);
  }

  // POST /finances/upload/:userId/:year
  uploadFinancialRecords(userId: number, year: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/finances/upload/${userId}/${year}`, formData);
  }
}
