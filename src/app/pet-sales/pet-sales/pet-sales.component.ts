import { Component, OnInit } from '@angular/core';
import { PetSalesService } from '../../core/services/pet-sales.service';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxApexchartsModule } from 'ngx-apexcharts';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-pet-sales',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatLabel,
    MatIcon,
    MatFormField,
    MatSnackBarModule,
    NgxApexchartsModule,
  ],
  templateUrl: './pet-sales.component.html',
  styleUrls: ['./pet-sales.component.scss'],
  providers: [DatePipe]
})
export class PetSalesComponent implements OnInit {
  chartOptions: any = {};
  dailySales: any[] = [];
  selectedDate = new Date();
  loading = false;
  dailyLoading = false;
  displayedColumns = ['date', 'animal', 'price'];

  constructor(
    private petSalesService: PetSalesService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.loadWeeklyData();
  }

  loadWeeklyData(): void {
    this.loading = true;
    const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd') || '';
    
    this.petSalesService.getWeeklySales(formattedDate).subscribe({
      next: (response) => {
        this.updateChart(response);
        this.loading = false;
      },
      error: (err) => {
        this.showError('Failed to load weekly data');
        this.loading = false;
      }
    });
  }

  loadDailySales(date: string): void {
    this.dailyLoading = true;
    this.petSalesService.getDailySales(date).subscribe({
      next: (response) => {
        console.log('Daily Sales Response:', response); // Add for debugging
        this.dailySales = response;
        this.dailyLoading = false;
      },
      error: (err) => {
        console.error('Daily Sales Error:', err); // Add for debugging
        this.showError('Failed to load daily data');
        this.dailyLoading = false;
      }
    });
  }

  private updateChart(data: any): void {
    this.chartOptions = {
      series: data.series,
      chart: {
        type: 'line',
        height: 400,
        events: {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
            const selectedDate = data.categories[config.dataPointIndex];
            this.loadDailySales(selectedDate);
          }
        }
      },  
      xaxis: {
        categories: data.categories.map((date: string) => 
          this.datePipe.transform(date, 'MMM dd') || date
        ),
        title: { text: 'Date' }
      },
      yaxis: {
        title: { text: 'Sales (USD)' },
        labels: {
          formatter: (value: number) => `$${value.toFixed(2)}`
        },
        min: 0
      },
      stroke: { 
        width: 3,
        curve: 'smooth'
      },
      markers: { size: 5 },
      tooltip: {
        y: {
          formatter: (value: number) => value > 0 ? `$${value.toFixed(2)}` : 'No sales'
        }
      },
      dataLabels: { enabled: false }
    };
  }

  onDateChange(event: any): void {
    this.selectedDate = event.value;
    this.loadWeeklyData();
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}