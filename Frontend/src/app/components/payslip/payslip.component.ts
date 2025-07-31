import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { PayslipData } from '../../interfaces/api.interface';

@Component({
  selector: 'app-payslip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.css']
})
export class PayslipComponent implements OnInit {
  payslipData: PayslipData | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadPayslip();
  }

  loadPayslip(): void {
    const employeeId = this.authService.getCurrentEmployeeId();
    if (!employeeId) {
      this.errorMessage = 'No employee ID found';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.employeeService.getPayslip({ EMPLOYEE_ID: employeeId }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.payslipData = response.data;
        } else {
          this.errorMessage = 'Failed to load payslip data';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error loading payslip data';
        console.error('Payslip error:', error);
      }
    });
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatCurrency(amount: string, currency: string): string {
    const numAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'EUR'
    }).format(numAmount);
  }
}