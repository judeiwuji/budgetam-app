import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordComponent } from '../modals/change-password/change-password.component';
import { ProfileComponent } from '../modals/profile/profile.component';
import { LinkManager } from '../models/LinkManager';
import User from '../models/User';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  public user: User = new User('');
  public baseUrl = LinkManager.baseUrl;

  constructor(
    private readonly modal: NgbModal,
    private readonly deviceService: DeviceDetectorService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly toastrService: ToastrService
  ) {}
  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user) => {
      this.user = user;
    });
  }

  editProfile() {
    const modalInstance = this.modal.open(ProfileComponent, {
      size: 'md',
      fullscreen: this.deviceService.isMobile(),
      scrollable: true,
      centered: true,
      backdrop: 'static',
    });

    modalInstance.componentInstance.user = this.user;
    modalInstance.result.then((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  changePassword() {
    this.modal.open(ChangePasswordComponent, {
      size: 'md',
      fullscreen: this.deviceService.isMobile(),
      scrollable: true,
      centered: true,
      backdrop: 'static',
    });
  }

  logout() {
    this.userService.logout().subscribe({
      next: (response) => {
        this.authService.logout();
      },
      error: (error) => {
        this.toastrService.warning(
          'Sorry, we were unable to process your request'
        );
      },
    });
  }
}
