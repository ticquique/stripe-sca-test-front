import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { PaymentsService } from '../../services/api/payments.service';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';
import { countries } from './countries';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
declare var stripe: any;

@Component({
  selector: 'stri-stripe-card',
  templateUrl: './stripe-card.component.html',
  styleUrls: ['./stripe-card.component.scss']
})
export class StripeCardComponent implements OnInit {

  constructor(
    private paymentService: PaymentsService,
    private fb: FormBuilder
  ) { }

  @Input() clientSecret: string;
  @Output() details: EventEmitter<stripe.BillingDetails> = new EventEmitter();
  @ViewChild('cardElement', { static: true }) cardElement: any;

  stripe: stripe.Stripe;
  card: stripe.elements.Element;
  cardErrors: stripe.Error;
  cardDetails: FormGroup = this.fb.group({
    email: ['', [Validators.required]],
    phone: [''],
    name: ['', [Validators.required]],
    address: this.fb.group({
      city: [''],
      country: [''],
      postal_code: [''],
      state: ['']
    })
  });

  countries = countries;
  loading = false;
  success = false;


  ngOnInit() {
    this.stripe = Stripe(environment.stripe_pk);
    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount(this.cardElement.nativeElement);
  }

  successMessage() {
    this.success = true;
    setTimeout(() => this.success = false, 600);
  }

  errorMessage(error: stripe.Error) {
    this.cardErrors = error;
    setTimeout(() => this.cardErrors = null, 1500);
  }

  getBillinDetails(): stripe.BillingDetails {
    const filterObject = (obj: any) => Object.keys(obj).reduce((old, current) => obj[current] ? { ...old, [current]: obj[current] } : old, {});
    const value: stripe.BillingDetails = this.cardDetails.value;
    if (value.address && value.address.country) {
      const country = this.countries.find(val => val.name === value.address.country);
      value.address.country = country ? country.code : '';
    }
    value.address = value.address && Object.keys(value.address).length ? filterObject(value.address) : null;
    return filterObject(value);
  }

  async createCardhandler() {
    this.loading = true;
    const serverSetupIntent = await this.paymentService.getSetupIntent().pipe(take(1)).toPromise();
    const billing_details = this.getBillinDetails();
    this.details.emit(billing_details);
    const setupIntent = await this.stripe.handleCardSetup(serverSetupIntent.client_secret, this.card, { payment_method_data: { billing_details } });
    if (setupIntent.error) {
      this.errorMessage(setupIntent.error);
    } else {
      const paymentMethod = await this.paymentService.attachPaymentMethod(setupIntent.setupIntent.payment_method).pipe(take(1)).toPromise();
      if (paymentMethod.error) {
        this.errorMessage(paymentMethod.error);
      } else {
        this.successMessage();
      }
    }

    this.loading = false;
  }
}
