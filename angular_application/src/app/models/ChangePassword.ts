export class ChangePasswordRequest {
  public oldPassword!: string;
  public password!: string;
}

export class ChangePasswordResponse {
  public message!: string;
  public success!: boolean;
}
