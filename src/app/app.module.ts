import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { OtpVerificationComponent } from './views/otp-verification/otp-verification.component';
import { AutoTabDirective, AutoTabDirectivePrev } from './shared/directives/autotabdirective';
import { NumberDirective } from './shared/directives/numbers-only.directive';
import { SharedModule } from './shared/shared.module';



//***************  TEST FIREBASE CONFIGURATION  ******************/
// export const firebaseConfig = {
//     apiKey: "AIzaSyBfpYU_7DfmnE9rj30SJ8ufsccKY2lmptU",
//     authDomain: "kawawa-music-68cb9.firebaseapp.com",
//     projectId: "kawawa-music-68cb9",
//     storageBucket: "kawawa-music-68cb9.appspot.com",
//     messagingSenderId: "708924357464",
//     appId: "1:708924357464:web:cdbd722e10f6e645f5032d",
//     measurementId: "G-S635QSEVKY"
// };
const firebaseConfig = {
  apiKey: "AIzaSyDwCO42cNmZiTSYdWy0aEVuXq-IGWbi86s",
  authDomain: "kawawa-music-c904d.firebaseapp.com",
  projectId: "kawawa-music-c904d",
  storageBucket: "kawawa-music-c904d.appspot.com",
  messagingSenderId: "557957380656",
  appId: "1:557957380656:web:a8f021d1dab2955f960bf5",
  measurementId: "G-N95M2KF20H"
};

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    IconModule,
    IconSetModule.forRoot(),
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    SharedModule
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    OtpVerificationComponent,
    AutoTabDirective,
    AutoTabDirectivePrev,
  ],
  providers: [
    IconSetService,
    MatDatepickerModule,
    MatNativeDateModule,
    AngularFireAuth
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
