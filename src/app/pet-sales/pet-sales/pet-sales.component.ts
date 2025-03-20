import { Component, OnInit } from '@angular/core';
import { PetSalesService } from '../../core/services/pet-sales.service';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxApexchartsModule } from 'ngx-apexcharts';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
    MatFormFieldModule, // Use this instead of MatFormField & MatLabel
    MatInputModule,     // Needed for [matInput] on your input element
    MatIcon,
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
  dataSource = new MatTableDataSource();


  constructor(
    private petSalesService: PetSalesService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.loadWeeklyData();
    // this.loadDailySales()
  }

  loadWeeklyData(): void {
    this.loading = true;
    const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd') || '';

    this.petSalesService.getWeeklySales(formattedDate).subscribe({
      next: (response) => {
        console.clear()
        console.log(response)
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
        console.log('Daily Sales Response:', response);
        this.dailySales = [...response];
        this.dataSource.data = response;
        this.dailyLoading = false;
      },
      error: (err) => {
        console.error('Daily Sales Error:', err);
        this.showError('Failed to load daily data');
        this.dailyLoading = false;
      }
    });
  }

  //   private clickHandler = (e: any, chartContext: any, config: any) => {
  //   const selectedDate = this.data.categories[config.dataPointIndex];
  //   this.loadDailySales(selectedDate);
  // }

  private updateChart(data: any): void {
    // Log the incoming data to verify structure
    console.log('Updating chart with data:', data);

    this.chartOptions = {
      series: data.series,
      chart: {
        events: {
          click: (event: any, chartContext: any, config: any) => {
            if (config.dataPointIndex !== undefined) {
              const selectedDate = data.categories[config.dataPointIndex];
              console.log('Clicked Date:', selectedDate); // Debug
              this.loadDailySales(selectedDate);
            }
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
      markers: { size: 8 },
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