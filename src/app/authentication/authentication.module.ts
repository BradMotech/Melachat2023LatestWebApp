import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { RegisterComponent } from './register/register.component';
import { ChooseTypeOfUserComponent } from './choose-type-of-user/choose-type-of-user.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChooseImageComponent } from './choose-image/choose-image.component';
import { NotifierModule, NotifierOptions } from 'angular-notifier';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'UserType', component: ChooseTypeOfUserComponent },
  { path: 'choose-image', component: ChooseImageComponent },
];

const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'left',
			distance: 12
		},
		vertical: {
			position: 'bottom',
			distance: 12,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};
@NgModule({
    declarations: [LoginComponent, WelcomeComponent, RegisterComponent, ChooseTypeOfUserComponent, ChooseImageComponent],
    imports: [CommonModule, RouterModule.forChild(routes), SharedModule,ReactiveFormsModule,  NotifierModule.withConfig(customNotifierOptions)]
})
export class AuthenticationModule { }
