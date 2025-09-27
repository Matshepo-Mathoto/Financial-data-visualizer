import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Chart as ChartJS } from 'chart.js';
import { FinanceService } from '../services/finance';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FileUpload } from './components/file-upload/file-upload';
import { Chart as ChartComponent } from './components/chart/chart';
import { TableComponent } from './components/table/table';
import { FinancialRecord, UserFinance } from './models';

@Component({
  selector: 'app-financial-record',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, FileUpload, ChartComponent, TableComponent],
  templateUrl: './financial-record.html',
  styleUrl: './financial-record.css'
})
export class FinancialRecordComponent {
  // Chart is now handled by Chart component

  userFinance: UserFinance | null = null;
  isLoading = false;
  file: File | null = null;
  // Chart logic moved to Chart component

  constructor(
    private financeService: FinanceService,
    private cdr: ChangeDetectorRef
  ) {}

  // Chart lifecycle handled in Chart component


  // Handle file upload events
  onFileSelected(file: File): void {
    console.log('File selected:', file.name);
    this.file = file;
    this.cdr.detectChanges();
  }

  // Upload & fetch
  submitFile(): void {
    console.log('Submit file called', this.file?.name);
    if (!this.file) {
      console.warn('No file to submit');
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    this.financeService.uploadFinancialRecords(1, 2025, this.file).subscribe({
      next: () => this.fetchRecords(),
      error: (err) => {
        console.error('Upload failed:', err);
        alert('File upload failed. Please try again.');
        this.isLoading = false;
      }
    });
  }

  fetchRecords() {
    this.financeService.getUserFinances(1, 2025).subscribe({
      next: (data) => {
        this.userFinance = data;
        this.isLoading = false;

        // Trigger change detection to ensure DOM is updated
        this.cdr.detectChanges();

  // Chart creation handled by Chart component
      },
      error: (error) => {
        console.error('Fetch failed:', error);
        this.isLoading = false;
      }
    });
  }

  // Chart logic moved to Chart component

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.click();
  }

  parseFloat(value: string): number {
    return Number.parseFloat(value) || 0;
  }

  getMonthName(monthNumber: number): string {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[monthNumber - 1] || `Month ${monthNumber}`;
  }
}

// Maintain backwards compatibility: export alias for existing imports
export { FinancialRecordComponent as FinancialRecord };
