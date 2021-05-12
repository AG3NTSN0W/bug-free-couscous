import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

  @ViewChild('myDialog', { static: true })
  myDialog!: TemplateRef<any>;
  
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

  companiesSub: Subscription = new Subscription;
  debtReportSub: Subscription = new Subscription;

  constructor(private reportService: ReportService, private dialog: MatDialog) {}

  ngOnDestroy(): void {
    this.companiesSub.unsubscribe();
    this.debtReportSub.unsubscribe();
  }

  ngOnInit(): void {}

  ngAfterViewInit() {

    this.companiesSub = this.reportService
    .getDebtCompanies()
    .subscribe((company: DebtCompanies[]) => {
      this.companies = company;
      this.selected = company[0].companyId;

      // Well... Cant stop me now :)
      this.debtReportSub = this.reportService
      .getDebtReport(this.selected, new Date())
      .subscribe((debtReport: DebtReport[]) => {
        this.debtReport = debtReport;
        this.dataSource.data = debtReport;
      });

    });

    this.dataSource = new MatTableDataSource();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteItem(index: number) {
    this.debtReport?.splice(index, 1);
    this.dataSource.data = this.debtReport;
    this.dialog.closeAll()
  }

  companyChange() {  
    this.debtReportSub.unsubscribe();
    this.debtReportSub = this.reportService
    .getDebtReport(this.selected, new Date())
    .subscribe((debtReport: DebtReport[]) => {
      this.debtReport = debtReport;
      this.dataSource.data = debtReport;
    });
  }

  openDialog(index: number) {
    this.dialog.open(this.myDialog, {data: {index: index}});
  }
}
