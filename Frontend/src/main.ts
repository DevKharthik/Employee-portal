import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './app/components/sidebar/sidebar.component';
import { DashboardComponent } from './app/components/dashboard/dashboard.component';
import { LoginComponent } from './app/components/login/login.component';
import { ProfileComponent } from './app/components/profile/profile.component';
import { LeaveComponent } from './app/components/leave/leave.component';
import { PayslipComponent } from './app/components/payslip/payslip.component';
import { AuthService } from './app/services/auth.service';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="app-container">
      <app-sidebar *ngIf="isLoggedIn"></app-sidebar>
      <main class="main-content" [class.with-sidebar]="isLoggedIn">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: #f5f5f5;
      display: flex;
    }
    
    .main-content {
      min-height: 100vh;
      flex-grow: 1;
    }
    
    .main-content.with-sidebar {
      margin-left: 250px;
    }
    
    @media (max-width: 768px) {
      .main-content.with-sidebar {
        margin-left: 200px;
      }
    }
  `]
})
export class App {
  constructor(private authService: AuthService) {}

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
}

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'leave', component: LeaveComponent },
  { path: 'payslip', component: PayslipComponent }
];

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
});