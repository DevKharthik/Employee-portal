import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { PayslipData } from '../../interfaces/api.interface';

@Component({
  selector: 'app-payslip',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.css']
})
export class PayslipComponent implements OnInit {
  payslipData: PayslipData | null = null;
  isLoading = false;
  errorMessage = '';
  // Add month/year state
  months = [
    { value: '01', name: 'January' },
    { value: '02', name: 'February' },
    { value: '03', name: 'March' },
    { value: '04', name: 'April' },
    { value: '05', name: 'May' },
    { value: '06', name: 'June' },
    { value: '07', name: 'July' },
    { value: '08', name: 'August' },
    { value: '09', name: 'September' },
    { value: '10', name: 'October' },
    { value: '11', name: 'November' },
    { value: '12', name: 'December' }
  ];
  years: string[] = [];
  selectedMonth = '';
  selectedYear = '';
  downloadLoading = false;

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService
  ) {
    // Populate years (last 10 years)
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
      this.years.push((currentYear - i).toString());
    }
    this.selectedMonth = this.months[new Date().getMonth()].value;
    this.selectedYear = currentYear.toString();
  }

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

  // Add downloadPayslip method
  downloadPayslip(): void {
    const employeeId = this.authService.getCurrentEmployeeId();
    if (!employeeId || !this.selectedMonth || !this.selectedYear) {
      this.errorMessage = 'Please select month and year.';
      return;
    }
    this.downloadLoading = true;
    this.errorMessage = '';
    this.employeeService.downloadPayslip({
      employeeId,
      month: this.months.find(m => m.value === this.selectedMonth)?.name || this.selectedMonth, // always a string
      year: this.selectedYear
    }).subscribe({
      next: (response) => {
        this.downloadLoading = false;
        if (response.success && response.pdf_base64) {
          const link = document.createElement('a');
          link.href = 'data:application/pdf;base64,' + response.pdf_base64;
          // Use month name in filename
          const monthName = this.months.find(m => m.value === this.selectedMonth)?.name || this.selectedMonth;
          const filename = `Payslip for the Month of ${monthName} ${this.selectedYear}.pdf`;
          link.download = filename;
          link.click();
        } else {
          this.errorMessage = 'Failed to download payslip.';
        }
      },
      error: (error) => {
        this.downloadLoading = false;
        this.errorMessage = 'Error downloading payslip.';
        console.error('Payslip download error:', error);
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