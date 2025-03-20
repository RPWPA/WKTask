// user-list.component.ts
import { Component, ViewChild, AfterViewInit, inject, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../types/User';
import { UserService } from '../../core/services/user.service';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserFormComponent } from '../../shared/user-form/user-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinner,
    MatIcon,
    MatFormField,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements AfterViewInit, OnInit {
  private userService = inject(UserService);
  private dialog = inject(MatDialog);


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  loading = false;
  private searchSubject = new Subject<string>();
  
  displayedColumns = ['id', 'fname', 'lname', 'username', 'actions'];
  dataSource = new MatTableDataSource<User>([]);
  
  // Pagination
  pageSize = 10;
  pageIndex = 0;
  totalItems = 0;
  searchTerm = '';

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => this.loadUsers());
  }

  ngAfterViewInit() {
    // Initialize sort with default values
    this.sort.active = 'id';
    this.sort.direction = 'asc';
    
    // Set initial parameters
    this.pageSize = 10;
    this.pageIndex = 0;

    // Initial data load
    this.loadUsers();

    // Watch for sort changes
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.loadUsers();
    });

    // Watch for pagination changes
    this.paginator.page.subscribe(() => {
      this.loadUsers();
    });
  }

  private loadUsers() {
    this.loading = true;
    
    this.userService.getUsers({
      search: this.searchTerm,
      page: this.pageIndex + 1,
      per_page: this.pageSize,
      sort_column: this.sort.active || 'id',
      sort_order: this.sort.direction || 'asc'
    }).subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.totalItems = response.total;
        
        // Force update of paginator
        this.paginator.length = response.total;
        this.paginator.pageIndex = this.pageIndex;
        this.paginator.pageSize = this.pageSize;
        this.loading = false;
      },
      error: (err) => console.error(err),
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue;
    this.paginator.pageIndex = 0;
    this.searchSubject.next(filterValue);
  }

  // Add this method
  openAddDialog(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: { user: null } // Pass null for new user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createUser(result);
      }
    });
  }

  // user-list.component.ts
  private createUser(userData: Omit<User, 'id'>) {
    this.loading = true;
    this.userService.createUser(userData).subscribe({
      next: (newUser: any) => {
        this.dataSource.data = [...this.dataSource.data, ...(newUser.user)];
      },
      error: (err) => {
        console.error('Create failed:', err);
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }
  
  // Add to existing code
  deleteUser(user: User): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { userName: `${user.fname} ${user.lname}` }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.performDelete(user.id);
      }
    });
  }

  private performDelete(userId: number): void {
    this.loading = true;
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(u => u.id !== userId);
      },
      error: (err) => {
        console.error('Delete failed:', err);
        alert('Failed to delete user. Please try again.');
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }

  openUserForm(user?: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (user) {
          this.updateUser(user.id, result);
        } else {
          this.createUser(result);
        }
      }
    });
  }

  private updateUser(userId: number, userData: User): void {
    this.loading = true;
    this.userService.updateUser(userId, userData).subscribe({
      next: (updatedUser: any) => {
        this.dataSource.data = this.dataSource.data.map(user => 
          user.id === userId ? { ...user, ...(updatedUser.user) } : user
        );
      },
      error: (err) => {
        console.error('Update failed:', err);
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }

}