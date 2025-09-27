import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FinanceService } from '../services/finance';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export interface FinancialRecord {
  month: number;
  amount: string;
  record_id: number;
}

export interface UserFinance {
  username: string;
  year: number;
  records: FinancialRecord[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements AfterViewInit, OnDestroy {
  @ViewChild('financeChart', { static: false }) chartRef!: ElementRef<HTMLCanvasElement>;

  isDragOver = false;
  fileName = '';
  file: File | null = null;
  userFinance: UserFinance | null = null;
  isLoading = false;
  private chart: Chart | null = null;
  private pendingChartCreation = false;

  constructor(
    private financeService: FinanceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    // Chart will be created after data is loaded
    if (this.pendingChartCreation && this.userFinance) {
      this.createChart();
      this.pendingChartCreation = false;
    }
  }

  ngOnDestroy() {
    this.destroyChart();
  }

  private destroyChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  // Drag & Drop handlers
  onDragOver(event: DragEvent) { event.preventDefault(); this.isDragOver = true; }
  onDragLeave(event: DragEvent) { event.preventDefault(); this.isDragOver = false; }
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files.length) {
      this.handleFileSelection(event.dataTransfer.files[0]);
    }
  }

  // File selection
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.handleFileSelection(input.files[0]);
  }

  private handleFileSelection(file: File) {
    const allowedExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(fileExtension || '')) {
      alert('Please select a valid file type (CSV, XLSX, XLS)');
      return;
    }
    this.file = file;
    this.fileName = file.name;
  }

  // Upload & fetch
  submitFile() {
    if (!this.file) return;

    this.isLoading = true;
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

        // Use multiple fallback strategies for chart creation
        this.attemptChartCreation();
      },
      error: (error) => {
        console.error('Fetch failed:', error);
        this.isLoading = false;
      }
    });
  }

  private attemptChartCreation() {
    if (!this.userFinance) {
      console.warn('No finance data available for chart creation');
      return;
    }

    // Wait for the next render cycle to ensure the canvas is ready
    requestAnimationFrame(() => {
      if (!this.chartRef?.nativeElement) {
        console.warn('Canvas element not available');
        this.pendingChartCreation = true;
        return;
      }

      const canvas = this.chartRef.nativeElement;
      // Set explicit dimensions based on the container
      const container = canvas.parentElement;
      if (container) {
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }

      this.createChart();
      // Ensure the change is detected
      this.cdr.detectChanges();
    });
  }

  // Chart
  private createChart() {
    if (!this.userFinance || !this.chartRef?.nativeElement) {
      console.warn('Cannot create chart: missing data or canvas element');
      return;
    }

    const canvasEl = this.chartRef.nativeElement;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    this.destroyChart();

    const sortedRecords = [...this.userFinance.records].sort((a, b) => a.month - b.month);
    const months = sortedRecords.map(r => this.getMonthName(r.month));
    const amounts = sortedRecords.map(r => parseFloat(r.amount));

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [{
          label: 'Amount ($)',
          data: amounts,
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top' },
          tooltip: {
            callbacks: {
              label: (ctx) => `Amount: $${ctx.parsed.y.toLocaleString()}`
            }
          }
        },
        scales: {
          y: { beginAtZero: true },
          x: { grid: { display: false } }
        }
      }
    });

    console.log('Chart created successfully');
  }

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

  getTotalAmount(): number {
    if (!this.userFinance) return 0;
    return this.userFinance.records.reduce((sum, r) => sum + this.parseFloat(r.amount), 0);
  }

  getAverageAmount(): number {
    if (!this.userFinance || !this.userFinance.records.length) return 0;
    return this.getTotalAmount() / this.userFinance.records.length;
  }
}
