import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ResetPasswordViews } from 'src/app/models/enums/ResetPasswordViews';
import { VerifyUserRequest } from 'src/app/models/ResetPassword';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  isMainView = false;
  isResetView = false;
  processing = false;
  verifyUserForm!: FormGroup;
  resetPasswordForm!: FormGroup;

  constructor(
    private readonly activeModal: NgbActiveModal,
    private readonly userService: UserService,
    private readonly toastrService: ToastrService
  ) {
    this.verifyUserForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
    });

    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      token: new FormControl('', [Validators.required]),
    });
  }

  get vc() {
    return this.verifyUserForm.controls;
  }

  get rc() {
    return this.resetPasswordForm.controls;
  }

  ngOnInit(): void {
    this.setView(ResetPasswordViews.main);
  }

  close() {
    this.activeModal.close();
  }

  setView(mode: ResetPasswordViews) {
    this.isMainView = mode === ResetPasswordViews.main;
    this.isResetView = mode === ResetPasswordViews.reset;
  }

  verifyUser() {
    if (this.processing) {
      return;
    }
    if (this.verifyUserForm.valid) {
      this.processing = true;
      const request = new VerifyUserRequest();
      request.email = this.vc['email'].value;

      this.userService.verifyUser(request).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastrService.success(response.message);
            // this.setView(ResetPasswordViews.reset);
            this.close();
          } else {
            this.toastrService.warning(response.message);
          }
        },
        error: (reason) => {
          this.processing = false;
          this.toastrService.warning(reason.error.error);
        },
        complete: () => {
          this.processing = false;
        },
      });
    }
  }

  resetPassword() {
    if (this.processing) {
      return;
    }
    if (this.resetPasswordForm.valid) {
      this.processing = true;
      const password = this.rc['password'].value;
      const token = this.rc['token'].value;

      this.userService.resetPassword(password, token).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastrService.success(response.message);
            this.close();
          } else {
            this.toastrService.warning(response.message);
          }
        },
        error: (reason) => {
          this.processing = false;
          this.toastrService.success(reason.error);
        },
        complete: () => {
          this.processing = false;
        },
      });
    }
  }
}
