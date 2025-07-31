import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private router: Router) {}

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  navigateToLeave(): void {
    this.router.navigate(['/leave']);
  }

  navigateToPayslip(): void {
    this.router.navigate(['/payslip']);
  }
}