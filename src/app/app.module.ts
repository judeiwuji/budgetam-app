import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { MainNavbarComponent } from './components/main-navbar/main-navbar.component';
import { MainFooterComponent } from './components/main-footer/main-footer.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ReportComponent } from './report/report.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthNavbarComponent } from './components/auth-navbar/auth-navbar.component';
// import { SlickCarouselModule } from 'ngx-slick-carousel';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainNavbarComponent,
    MainFooterComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    TransactionsComponent,
    ReportComponent,
    ProfileComponent,
    AuthNavbarComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    ReactiveFormsModule /*SlickCarouselModule*/,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
