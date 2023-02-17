import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ChangePasswordComponent } from '../modals/change-password/change-password.component';
import { ProfileComponent } from '../modals/profile/profile.component';
import User from '../models/User';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  public user: User = new User('judoski');

  constructor(
    private readonly modal: NgbModal,
    private deviceService: DeviceDetectorService
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
}
