import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { DebtCompanies, DebtReport } from '../service/report/model';
import { ReportService } from '../service/report/report.service';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, AfterViewInit {
  companies: Observable<DebtCompanies[]> | undefined;

  displayedColumns: string[] = [
    'companyName',
    'days60',
    'days30',
    'current',
    'totalDue',
    'totalPaid',
    'escalationDate',
    'statusDescription',
  ];
  dataSource = new MatTableDataSource<DebtReport>();
  debtReportSub: Subscription | undefined;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.debtReportSub = this.reportService
      .getDebtReport(1, new Date())
      .subscribe((debtReport: DebtReport[]) => {
        this.dataSource.data = debtReport;
      });

    this.companies = this.reportService.getDebtCompanies();

    this.dataSource = new MatTableDataSource();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
