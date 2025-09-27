import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { FinancialRecord } from '../../models';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.css'
})
export class TableComponent {
  @Input() records: FinancialRecord[] = [];
  @Input() parseFloatFn: (v: string) => number = (v) => Number.parseFloat(v) || 0;
  @Input() getMonthNameFn: (m: number) => string = (m) => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[m - 1] || `Month ${m}`;
  };
}
