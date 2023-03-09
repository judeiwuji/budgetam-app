import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordRequest } from 'src/app/models/ChangePassword';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  processing = false;

  constructor(
    private readonly activeModal: NgbActiveModal,
    private readonly userService: UserService,
    private readonly toastrService: ToastrService
  ) {
    this.passwordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  close() {
    this.activeModal.close();
  }

  ngOnInit(): void {}

  get fc() {
    return this.passwordForm.controls;
  }

  confirm() {
    if (this.processing) return;
    this.passwordForm.markAsTouched();

    if (this.passwordForm.valid) {
      this.processing = true;
      const request = new ChangePasswordRequest();
      request.oldPassword = this.fc['oldPassword'].value;
      request.password = this.fc['password'].value;

      this.userService.changePassword(request).subscribe({
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
          this.toastrService.warning(reason.error);
        },
        complete: () => {
          this.processing = false;
        },
      });
    }
  }
}
