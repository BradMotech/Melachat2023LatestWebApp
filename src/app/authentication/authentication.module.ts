import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { RegisterComponent } from './register/register.component';
import { ChooseTypeOfUserComponent } from './choose-type-of-user/choose-type-of-user.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'UserType', component: ChooseTypeOfUserComponent },
];

@NgModule({
    declarations: [LoginComponent, WelcomeComponent, RegisterComponent, ChooseTypeOfUserComponent],
    imports: [CommonModule, RouterModule.forChild(routes), SharedModule,ReactiveFormsModule]
})
export class AuthenticationModule { }
