// attractions/attraction-list.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-attraction-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
  template: `
    <h2>Attractions Management</h2>
    <!-- Add attraction table content here -->
    <button mat-raised-button color="primary" routerLink="/attractions/new">
      <mat-icon>add</mat-icon>
      Add Attraction
    </button>
  `,
  styles: [`
    h2 { margin: 1rem 0; }
    button { margin-top: 1rem; }
  `]
})
export class AttractionListComponent {}