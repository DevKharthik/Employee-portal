import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse } from '../interfaces/api.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api'; // Change port here
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private currentEmployeeIdSubject = new BehaviorSubject<string>('');

  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  public currentEmployeeId$ = this.currentEmployeeIdSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    const employeeId = localStorage.getItem('employeeId');
    if (employeeId) {
      this.isLoggedInSubject.next(true);
      this.currentEmployeeIdSubject.next(employeeId);
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('http://localhost:5000/api/employee/login', credentials)
      .pipe(
        tap(response => {
          if (response.success) {
            localStorage.setItem('employeeId', credentials.EMPLOYEE_ID);
            this.isLoggedInSubject.next(true);
            this.currentEmployeeIdSubject.next(credentials.EMPLOYEE_ID);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('employeeId');
    this.isLoggedInSubject.next(false);
    this.currentEmployeeIdSubject.next('');
  }

  getCurrentEmployeeId(): string {
    return localStorage.getItem('employeeId') || '';
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('employeeId');
  }
}