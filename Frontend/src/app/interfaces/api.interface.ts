export interface LoginRequest {
  EMPLOYEE_ID: string;
  PASSWORD: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
}

export interface ProfileRequest {
  EMPLOYEE_ID: string;
}

export interface ProfileData {
  PERSNO: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  EMAIL: string;
  GENDER: string;
  DOB: string;
  JOIN_DATE: string;
  COMPANY: string;
  COM_NAME: string;
  COM_STREET: string;
  COM_CITY: string;
  COMP_PIN: string;
  COM_COUNTRY: string;
  COM_COUNTRY_TXT: string;
  CITY: string;
  PIN_CODE: string;
  COUNTRY: string;
  COUNTRY_TXT: string;
  NATIONALITY: string;
  NATIONALITY_TXT: string;
  EMP_GROUP: string;
  EMP_SUBGROUP: string;
  PERS_AREA: string;
  PERS_SUBAREA: string;
}

export interface ProfileResponse {
  success: boolean;
  data: ProfileData;
}

export interface LeaveAbsence {
  PERNR: string;
  BEGDA: string;
  ENDDA: string;
  STDAZ: string;
  ABWTG: string;
  AWART: string;
  KTART: string;
  ANZHL: string;
  REASON: string;
}

export interface LeaveQuota {
  PERNR: string;
  BEGDA: string;
  ENDDA: string;
  STDAZ: string;
  ABWTG: string;
  AWART: string;
  KTART: string;
  ANZHL: string;
  REASON: string;
}

export interface LeaveData {
  EV_TOTAL_QUOTA: string;
  EV_LEAVE_TAKEN: string;
  EV_HOURS: string;
  EV_DAYS: string;
  ET_ABSENCES: LeaveAbsence[];
  ET_QUOTAS: LeaveQuota[];
}

export interface LeaveResponse {
  success: boolean;
  data: LeaveData;
}

export interface PayslipData {
  PERNR: string;
  COSTCENTER: string;
  PAYTYPE: string;
  PAYAREA: string;
  PAYGROUP: string;
  PAYLEVEL: string;
  WAGETYPE: string;
  CURR: string;
  SALARY: string;
  ANNUAL: string;
  CAPACITY: string;
  WORKHRS: string;
  BANK_NAME: string;
  BANK_KEY: string;
  ACC_NO: string;
  BEGDA: string;
  ENDDA: string;
}

export interface PayslipResponse {
  success: boolean;
  data: PayslipData;
}