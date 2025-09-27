
import { Component, Input, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Chart as ChartJS } from 'chart.js';
import type { UserFinance } from '../../models';

@Component({
  selector: 'app-chart',
  standalone: true,
  templateUrl: './chart.html',
  styleUrl: './chart.css'
})
export class Chart implements AfterViewInit, OnDestroy {
  @Input() userFinance: UserFinance | null = null;
  @ViewChild('financeChart', { static: false }) chartRef!: ElementRef<HTMLCanvasElement>;
  private chart: ChartJS | null = null;

  ngAfterViewInit() {
    this.createChart();
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

  private createChart() {
    if (!this.userFinance || !this.chartRef?.nativeElement) {
      return;
    }
    const canvasEl = this.chartRef.nativeElement;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;
    this.destroyChart();
    const sortedRecords = [...this.userFinance.records].sort((a, b) => a.month - b.month);
    const months = sortedRecords.map(r => this.getMonthName(r.month));
    const amounts = sortedRecords.map(r => parseFloat(r.amount));
  this.chart = new ChartJS(ctx, {
  type: 'bar',
  data: {
    labels: months,
    datasets: [
      {
        label: 'Amount ($)',
        data: amounts,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        borderRadius: 6
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Amount: $${ctx.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount (R)',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      x: {
        grid: { display: false },
        title: {
          display: true,
          text: 'Months',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    }
  }
});

  }

  getMonthName(monthNumber: number): string {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[monthNumber - 1] || `Month ${monthNumber}`;
  }
}
