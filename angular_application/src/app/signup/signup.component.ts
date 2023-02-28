import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import User from '../models/User';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  newAccount!: FormGroup;
  processing = false;

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly toastrService: ToastrService
  ) {
    this.newAccount = new FormGroup({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
  ngOnInit(): void {}

  get formControls() {
    return this.newAccount.controls;
  }

  createAccount() {
    if (this.processing) return;

    this.processing = true;
    this.newAccount.markAllAsTouched();
    if (this.newAccount.valid) {
      const user = new User(this.formControls['username'].value);
      user.email = this.formControls['email'].value;
      user.password = this.formControls['password'].value;
      this.userService.signup(user).subscribe({
        next: (response) => {
          console.log(response);
          this.toastrService.success('Account created!');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.log(error);
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
