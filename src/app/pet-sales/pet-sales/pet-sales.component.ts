// pet-sales/pet-sales.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pet-sales',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dashboard">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Pet Sales Statistics</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <!-- Add charts here -->
          <p>Sales data visualization coming soon</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard { padding: 1rem; }
    mat-card { max-width: 800px; margin: 0 auto; }
  `]
})
export class PetSalesComponent {}