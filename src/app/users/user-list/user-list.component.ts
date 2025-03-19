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
    MatLabel,
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
  private filterSubject = new Subject<string>();
  filter$ = this.filterSubject.asObservable();

  private dialog = inject(MatDialog);

  displayedColumns = ['id', 'fname', 'lname', 'actions'];
  dataSource = new MatTableDataSource<User>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  loading = false;

  ngOnInit() {
    this.loadUsers();
    this.setupFilter();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'fname': return item.fname.toLowerCase();
        case 'lname': return item.lname.toLowerCase();
        default: return item[property as keyof User];
      }
    };

    this.dataSource.filterPredicate = (data: User, filter: string) => {
      const searchString = filter.toLowerCase();
      return (
        data.fname.toLowerCase().includes(searchString) ||
        data.lname.toLowerCase().includes(searchString) ||
        data.username.toLowerCase().includes(searchString)
      );
    };
  }

  private setupFilter() {
    this.filter$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(filterValue => {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterSubject.next(filterValue);
  }

  private loadUsers() {
    this.loading = true;
    this.userService.getUsers()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (users) => {
          this.dataSource.data = users;
        },
        error: (err) => console.error(err)
      });
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
      next: (newUser) => {
        this.dataSource.data = [...this.dataSource.data, newUser];
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
      next: (updatedUser) => {
        this.dataSource.data = this.dataSource.data.map(user => 
          user.id === userId ? { ...user, ...updatedUser } : user
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