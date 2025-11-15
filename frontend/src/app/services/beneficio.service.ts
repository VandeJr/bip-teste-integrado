import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../model/page';
import { Beneficio } from '../model/beneficio';

@Injectable({
  providedIn: 'root'
})
export class BeneficioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8090/api/v1/beneficios';

  findAll(page: number, size: number): Observable<Page<Beneficio>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<Beneficio>>(this.apiUrl, { params });
  }

  findById(id: number): Observable<Beneficio> {
    return this.http.get<Beneficio>(`${this.apiUrl}/${id}`);
  }

  create(beneficio: Beneficio): Observable<Beneficio> {
    return this.http.post<Beneficio>(this.apiUrl, beneficio);
  }

  update(id: number, beneficio: Beneficio): Observable<Beneficio> {
    return this.http.put<Beneficio>(`${this.apiUrl}/${id}`, beneficio);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  transfer(fromId: number, toId: number, amount: number): Observable<void> {
    const request = { fromId, toId, amount };
    return this.http.post<void>(`${this.apiUrl}/transfer`, request);
  }
}
