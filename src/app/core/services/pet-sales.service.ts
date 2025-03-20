import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PetSalesService {
  private apiUrl = 'https://www.melivecode.com/api';

  constructor(private http: HttpClient) { }

  getWeeklySales(startDate: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pets/7days/${startDate}`).pipe(
      map((response: any) => ({
        ...response,
        series: response.series.map((series: any) => ({
          ...series,
          data: series.data.map((value: any) => Number(value))
        }))
      }))
    );
  }

  getDailySales(date: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pets/${date}`).pipe(
      map((response: any) => 
        response.map((item: any) => ({
          ...item,
          price: Number(item.price)
        }))
      )
    );
  }
}