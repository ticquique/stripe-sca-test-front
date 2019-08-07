import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { UserService } from './services/api/user.service';
import { PaymentsService } from './services/api/payments.service';
import { StripeCardComponent } from './components/stripe-card/stripe-card.component';


@NgModule({
  declarations: [
    DropdownComponent,
    StripeCardComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    DropdownComponent,
    StripeCardComponent,
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        UserService,
        PaymentsService
      ]
    };
  }
}