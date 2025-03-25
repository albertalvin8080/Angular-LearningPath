import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignInComponent } from './sign-in/sign-in.component';

// This is an example of Feature Model (you could use thit for Lazy Loading)
@NgModule({
  declarations: [
    SignInComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class UserModule { }
