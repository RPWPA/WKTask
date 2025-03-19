// user-form.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  MatDialogModule, 
  MAT_DIALOG_DATA, 
  MatDialogRef 
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { 
  FormBuilder, FormGroup, // <-- This is the "fb" being used
  ReactiveFormsModule, 
  Validators 
} from '@angular/forms';
import { User } from '../../types/User';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-form.component.html', // Your template goes here
  styleUrls: ['./user-form.component.scss'] // Your styles go here
})
export class UserFormComponent {
  public userForm: FormGroup;

  constructor(
    private fb: FormBuilder, // <-- Injected here (this is the "fb")
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User }
  ) {
    this.userForm = this.fb.group({
      id: [{ value: '', disabled: true }],  // Add ID control
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      avatar: ['']
    });
    if (this.data?.user) {
      // Deep copy to prevent form changes from affecting original data
      const userCopy = JSON.parse(JSON.stringify(this.data.user));
      this.userForm.patchValue(userCopy);
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.getRawValue(); // Include disabled fields
      this.dialogRef.close(formData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}