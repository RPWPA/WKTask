import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { apiUrl } from '../../environment';

@Injectable({ providedIn: 'root' })
export class PetSalesService {

  constructor(private http: HttpClient) { }

  getWeeklySales(startDate: string): Observable<any> {
    return this.http.get(`${apiUrl}/pets/7days/${startDate}`).pipe(
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
    return this.http.get(`${apiUrl}/pets/${date}`).pipe(
      map((response: any) => 
        response.map((item: any) => ({
          ...item,
          price: Number(item.price)
        }))
      )
    );
  }
}