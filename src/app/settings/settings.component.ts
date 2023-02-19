import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ChangePasswordComponent } from '../modals/change-password/change-password.component';
import { ProfileComponent } from '../modals/profile/profile.component';
import User from '../models/User';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  public user: User = new User('judoski');

  constructor(
    private readonly modal: NgbModal,
    private readonly deviceService: DeviceDetectorService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}
  ngOnInit(): void {}

  editProfile() {
    this.modal.open(ProfileComponent, {
      size: 'md',
      fullscreen: this.deviceService.isMobile(),
      scrollable: true,
      centered: true,
      backdrop: 'static',
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
    this.authService.logout();
  }
}
