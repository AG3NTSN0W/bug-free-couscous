import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DebtCompanies, DebtReport } from './model';

const BASE_URL =
  'http://mogwai-dev.eu-west-1.elasticbeanstalk.com/api/report/debt';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}

  public getDebtReport(companyId: number, date: Date): Observable<DebtReport[]> {
    return this.http.get<DebtReport[]>(
      `${BASE_URL}/${companyId}/${convertDate(date)}`
    );
  }

  public getDebtCompanies(): Observable<DebtCompanies[]> {
    return this.http.get<DebtCompanies[]>(`${BASE_URL}/companies`);
  }
}

const convertDate = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};
