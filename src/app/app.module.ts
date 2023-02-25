import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgChartsModule } from 'ng2-charts';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { MainNavbarComponent } from './components/main-navbar/main-navbar.component';
import { MainFooterComponent } from './components/main-footer/main-footer.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportComponent } from './report/report.component';
import { ProfileComponent } from './modals/profile/profile.component';
import { AuthNavbarComponent } from './components/auth-navbar/auth-navbar.component';
import { TransactionCategoryComponent } from './components/transaction-category/transaction-category.component';
import { CategoryTransactionsComponent } from './modals/category-transactions/category-transactions.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { TransactionFormComponent } from './modals/transaction-form/transaction-form.component';
import { TransactionsComponent } from './modals/transactions/transactions.component';
import { ChangePasswordComponent } from './modals/change-password/change-password.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { BalanceCardComponent } from './components/balance-card/balance-card.component';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { TransactionReportComponent } from './components/transaction-report/transaction-report.component';
import { SettingsComponent } from './settings/settings.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './auth/token.interceptor';

const dbConfig: DBConfig = {
  name: 'BudgetamDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'categories',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: true } },
        { name: 'icon', keypath: 'icon', options: { unique: false } },
        { name: 'isExpense', keypath: 'isExpense', options: { unique: false } },
      ],
    },
    {
      store: 'transactions',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'amount', keypath: 'amount', options: { unique: false } },
        { name: 'note', keypath: 'note', options: { unique: false } },
        { name: 'date', keypath: 'date', options: { unique: false } },
        {
          name: 'catId',
          keypath: 'catId',
          options: { unique: false },
        },
        {
          name: 'userId',
          keypath: 'userId',
          options: { unique: false },
        },
      ],
    },
    {
      store: 'users',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'username', keypath: 'username', options: { unique: false } },
        { name: 'avatar', keypath: 'avatar', options: { unique: false } },
      ],
    },
  ],
};

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
    ChangePasswordComponent,
    TransactionListComponent,
    BalanceCardComponent,
    BarChartComponent,
    TransactionReportComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot(),
    NgChartsModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    HttpClientModule,
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
