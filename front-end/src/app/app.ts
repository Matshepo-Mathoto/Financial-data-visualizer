import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FinanceService } from '../services/finance';
import { Chart, registerables } from 'chart.js';
import { FinancialRecord } from '../financial-record/financial-record';

Chart.register(...registerables);



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FinancialRecord],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App  {

}
