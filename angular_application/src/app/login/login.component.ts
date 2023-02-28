import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginRequest } from '../models/Login';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  processing = false;

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly toastrService: ToastrService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
  ngOnInit(): void {}

  get formControls() {
    return this.loginForm.controls;
  }

  login() {
    if (this.processing) return;

    this.processing = true;
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      const request = new LoginRequest(
        this.formControls['email'].value,
        this.formControls['password'].value
      );

      this.userService.login(request).subscribe({
        next: (response) => {
          this.authService.login(response.token as string);
        },
        error: (error) => {
          this.processing = false;
          this.toastrService.warning(
            'Sorry, we were unable to process your request'
          );
        },
        complete: () => {
          this.processing = false;
        },
      });
    }
  }
}
