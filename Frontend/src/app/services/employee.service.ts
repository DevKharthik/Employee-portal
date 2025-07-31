import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  ProfileRequest, 
  ProfileResponse, 
  LeaveResponse, 
  PayslipResponse 
} from '../interfaces/api.interface';

export interface LoginRequest {
  EMPLOYEE_ID: string;
  PASSWORD: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = 'http://localhost:5000/api'; // Change port here

  constructor(private http: HttpClient) {}

  getProfile(request: ProfileRequest): Observable<ProfileResponse> {
    return this.http.post<ProfileResponse>(`${this.baseUrl}/employee/profile`, request);
  }

  getLeaveDetails(request: ProfileRequest): Observable<LeaveResponse> {
    return this.http.post<LeaveResponse>(`${this.baseUrl}/employee/leave`, request);
  }

  getPayslip(request: ProfileRequest): Observable<PayslipResponse> {
    return this.http.post<PayslipResponse>(`${this.baseUrl}/employee/payslip`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('http://localhost:5000/api/employee/login', request);
  }
}