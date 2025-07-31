import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { ProfileData } from '../../interfaces/api.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileData: ProfileData | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const employeeId = this.authService.getCurrentEmployeeId();
    if (!employeeId) {
      this.errorMessage = 'No employee ID found';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.employeeService.getProfile({ EMPLOYEE_ID: employeeId }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.profileData = response.data;
        } else {
          this.errorMessage = 'Failed to load profile data';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error loading profile data';
        console.error('Profile error:', error);
      }
    });
  }

  getInitials(): string {
    if (!this.profileData) return '';
    const firstName = this.profileData.FIRST_NAME?.[0] || '';
    const lastName = this.profileData.LAST_NAME?.[0] || '';
    return (firstName + lastName).toUpperCase();
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}