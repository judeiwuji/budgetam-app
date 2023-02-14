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
import { ReportComponent } from './report/report.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthNavbarComponent } from './components/auth-navbar/auth-navbar.component';
import { TransactionCategoryComponent } from './components/transaction-category/transaction-category.component';
import { CategoryTransactionsComponent } from './modals/category-transactions/category-transactions.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { TransactionFormComponent } from './modals/transaction-form/transaction-form.component';
import { TransactionsComponent } from './modals/transactions/transactions.component';

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
    TransactionCategoryComponent,
    CategoryTransactionsComponent,
    TransactionComponent,
    TransactionFormComponent,
    TransactionsComponent,
  ],
  imports: [BrowserModule, NgbModule, AppRoutingModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
