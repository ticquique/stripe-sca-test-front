import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [NavbarComponent],
  imports: [
    SharedModule,
  ],
  exports: [
    NavbarComponent
  ]
})
export class NavbarModule { }
