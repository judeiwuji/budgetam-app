export class LoginRequest {
  constructor(public email: string, public password: string) {}
}

export interface LoginResponse {
  token?: string;
  expiresAt?: string;
}
