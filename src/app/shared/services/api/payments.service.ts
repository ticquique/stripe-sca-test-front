import { Injectable } from '@angular/core';
import { Api } from './api';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { switchMap, filter } from 'rxjs/operators';
import { UserService } from './user.service';
import { Observable } from 'rxjs';

interface Metadata {
  user_id: string;
}

export interface PaymentSetupIntent {
  id: string;
  object: string;
  application?: any;
  cancellation_reason?: any;
  client_secret?: any;
  created: number;
  customer?: any;
  description?: any;
  last_setup_error?: any;
  livemode: boolean;
  metadata: Metadata;
  next_action?: any;
  on_behalf_of?: any;
  payment_method?: any;
  payment_method_options: PaymentMethodOptions;
  payment_method_types: 'card' | 'card_present'[];
  status: string;
  usage: 'off_session' | 'on_session';
}

interface Error {
  message: string;
  param: string;
  type: string;
}

export interface Address {
  city?: any;
  country?: any;
  line1?: any;
  line2?: any;
  postal_code: string;
  state?: any;
}

export interface BillingDetails {
  address: Address;
  email?: any;
  name?: any;
  phone?: any;
}

export interface FraudDetails {
}

export interface Outcome {
  network_status: string;
  reason?: any;
  risk_level: string;
  risk_score: number;
  seller_message: string;
  type: string;
}

export interface Checks {
  address_line1_check?: any;
  address_postal_code_check: string;
  cvc_check: string;
}

export interface Card {
  brand: string;
  checks: Checks;
  country: string;
  exp_month: number;
  exp_year: number;
  fingerprint: string;
  funding: string;
  last4: string;
  three_d_secure?: any;
  wallet?: any;
  request_three_d_secure?: string;
}

export interface PaymentMethodDetails {
  card: Card;
  type: string;
}


export interface Datum {
  id: string;
  object: string;
  amount: number;
  amount_refunded: number;
  application?: any;
  application_fee?: any;
  application_fee_amount?: any;
  balance_transaction: string;
  billing_details: BillingDetails;
  captured: boolean;
  created: number;
  currency: string;
  customer?: any;
  description?: any;
  destination?: any;
  dispute?: any;
  failure_code?: any;
  failure_message?: any;
  fraud_details: FraudDetails;
  invoice?: any;
  livemode: boolean;
  metadata: Metadata;
  on_behalf_of?: any;
  order?: any;
  outcome: Outcome;
  paid: boolean;
  payment_intent: string;
  payment_method: string;
  payment_method_details: PaymentMethodDetails;
  receipt_email?: any;
  receipt_number?: any;
  receipt_url: string;
  refunded: boolean;
  refunds: Charges;
  review?: any;
  shipping?: any;
  source?: any;
  source_transfer?: any;
  statement_descriptor?: any;
  status: string;
  transfer_data?: any;
  transfer_group?: any;
}

export interface Charges {
  object: string;
  data: Datum[];
  has_more: boolean;
  total_count: number;
  url: string;
}

export interface PaymentMethodOptions {
  card?: Card;
}

export interface PaymentIntent {
  id: string;
  object: string;
  allowed_source_types: string[];
  amount: number;
  amount_capturable: number;
  amount_received: number;
  application?: any;
  application_fee_amount?: any;
  canceled_at?: any;
  cancellation_reason?: any;
  capture_method: string;
  charges: Charges;
  client_secret: string;
  confirmation_method: string;
  created: number;
  currency: string;
  customer?: any;
  description?: any;
  invoice?: any;
  last_payment_error?: any;
  livemode: boolean;
  metadata?: Metadata;
  next_action?: any;
  next_source_action?: any;
  on_behalf_of?: any;
  payment_method: string;
  payment_method_options: PaymentMethodOptions;
  payment_method_types: string[];
  receipt_email?: any;
  review?: any;
  setup_future_usage?: any;
  shipping?: any;
  source?: any;
  statement_descriptor?: any;
  status: string;
  transfer_data?: any;
  transfer_group?: any;
}

export interface StripeError {
  error: stripe.Error;
}

export interface PaymentIntentResponse {
  requires_action: boolean;
  payment_intent_client_secret: string;
  intent: PaymentIntent;
  success: boolean;
  error: string;
}

@Injectable()
export class PaymentsService extends Api {

  constructor(httpClient: HttpClient, private userService: UserService) { super('payment', httpClient); }

  getSetupIntent(params?: [string, any][]): Observable<PaymentSetupIntent> {
    return this.userService.user$.pipe(
      filter(user => user !== null),
      switchMap(_ => this.getAll<PaymentSetupIntent>('setup_intents', params))
    );
  }

  attachPaymentMethod(payment_method_id, params?: [string, any][]) {
    return this.userService.user$.pipe(
      filter(user => user !== null),
      switchMap(_ => this.create<stripe.PaymentMethodResponse>({payment_method_id}, 'attach_payment_method', params))
    );
  }

  confirmPaymentIntent(payment_intent_id, params?: [string, any][]) {
    return this.userService.user$.pipe(
      filter(user => user !== null),
      switchMap(_ => this.create<PaymentIntentResponse>({payment_intent_id}, 'confirm__payment_intent', params))
    );
  }

  createPaymentIntent(
    payment_method, 
    customer: string, 
    amount: number, 
    currency: 'eur' | 'usd' = 'eur', 
    params?: [string, any][]
  ): Observable<PaymentIntentResponse> {
    return this.userService.user$.pipe(
      filter(user => user !== null),
      switchMap(_ => this.create<PaymentIntentResponse>({
        payment_method,
        customer,
        amount,
        currency,
        confirmation_method: 'manual',
        confirm: true
      }, 'payment_intent', params))
    );
  }
}
