import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { LeaveData, LeaveAbsence, LeaveQuota } from '../../interfaces/api.interface';

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css']
})
export class LeaveComponent implements OnInit {
  leaveData: LeaveData | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadLeaveDetails();
  }

  loadLeaveDetails(): void {
    const employeeId = this.authService.getCurrentEmployeeId();
    if (!employeeId) {
      this.errorMessage = 'No employee ID found';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.employeeService.getLeaveDetails({ EMPLOYEE_ID: employeeId }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.leaveData = response.data;
        } else {
          this.errorMessage = 'Failed to load leave data';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error loading leave data';
        console.error('Leave error:', error);
      }
    });
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getLeaveTypeClass(reason: string): string {
    const lowerReason = reason.toLowerCase();
    if (lowerReason.includes('paid')) return 'leave-paid';
    if (lowerReason.includes('annual')) return 'leave-annual';
    if (lowerReason.includes('loss')) return 'leave-unpaid';
    return 'leave-other';
  }
}