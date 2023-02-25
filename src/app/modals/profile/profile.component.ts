import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import User from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  public user!: User;
  public imageFile: File | null = null;
  public avatarPreview?: string;
  public username = '';
  public saving = false;
  public uploading = false;

  constructor(
    private readonly activeModal: NgbActiveModal,
    private readonly userService: UserService,
    private readonly toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(JSON.stringify(this.user));
    this.username = this.user.username;
  }

  close() {
    this.activeModal.close(this.user);
  }

  cancel() {
    this.avatarPreview = '';
    this.imageFile = null;
  }

  changeAvatar(event: any) {
    this.imageFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      this.avatarPreview = ev.target?.result as string;
    };
    reader.readAsDataURL(this.imageFile as File);
  }

  save() {
    if (this.saving) return;
    this.saving = true;
    const user: User = JSON.parse(JSON.stringify(this.user));
    user.username = this.username;

    this.userService.updateAccount(user).subscribe((success) => {
      this.saving = false;
      if (success) {
        this.user = user;
        this.toastrService.success('saved');
      }
    });
  }

  /**
   * @description upload user avatar
   */
  uploadAvatar() {
    if (this.uploading) return;
    this.uploading = true;

    const user = JSON.parse(JSON.stringify(this.user));
    user.avatar = this.avatarPreview;
    this.userService
      .uploadAvatar(user, this.imageFile as File)
      .subscribe((success) => {
        this.uploading = false;
        if (success) {
          this.user = user;
          this.cancel();
          this.toastrService.success('success');
        }
      });
  }
}
