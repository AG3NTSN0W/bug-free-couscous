import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
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
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  mySubscriptions: Subscription[] = [];
  debtReport: DebtReport[] = [];
  companies: DebtCompanies[] = [];

  selected!: number;

  displayedColumns: string[] = [
    'companyName',
    'days60',
    'days30',
    'current',
    'totalDue',
    'totalPaid',
    'escalationDate',
    'statusDescription',
    'action',
  ];
  dataSource = new MatTableDataSource<DebtReport>();

  constructor(private reportService: ReportService) {}

  ngOnDestroy(): void {
    for (const subs of this.mySubscriptions) {
      subs.unsubscribe();
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    const companiesSub = this.reportService
      .getDebtCompanies()
      .subscribe((company: DebtCompanies[]) => {
        this.companies = company;
        this.selected = company[0].companyId;
      });

      // I cant use 1 as default because there might no be there. i
    const debtReportSub = this.reportService
      .getDebtReport(1, new Date())
      .subscribe((debtReport: DebtReport[]) => {
        this.debtReport = debtReport;
        this.dataSource.data = debtReport;
      });

    this.mySubscriptions.push(companiesSub);
    this.mySubscriptions.push(debtReportSub);

    this.dataSource = new MatTableDataSource();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteItem(index: number) {
    this.debtReport?.splice(index, 1);
    this.dataSource.data = this.debtReport;
  }

  companyChange() {  }
}
