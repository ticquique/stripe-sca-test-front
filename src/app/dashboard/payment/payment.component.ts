import { Component, OnInit } from '@angular/core';
import { PaymentsService, PaymentIntentResponse } from 'src/app/shared/services/api/payments.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, NextObserver } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'stri-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  stripe: stripe.Stripe;
  cardErrors: string;
  success = false;
  private routeSub: Subscription;

  constructor(
    private paymentService: PaymentsService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.stripe = Stripe(environment.stripe_pk);
    const secretObserver: NextObserver<PaymentIntentResponse> = {next: (secret) => this.handlePayment(secret)}
    this.routeSub = this.route.params.pipe(
      switchMap(val => this.stripe.handleCardAction(val['id'])),
      switchMap(val => this.paymentService.confirmPaymentIntent(val.paymentIntent.id)),
    ).subscribe(secretObserver);
 
  }

  async handlePayment(response: PaymentIntentResponse) {
    if (response.error) { 
      this.cardErrors = response.error;
    } else if (response.requires_action) {
      const newIntent = await this.stripe.handleCardAction(response.payment_intent_client_secret);
      const newResponse = await this.paymentService.confirmPaymentIntent(newIntent.paymentIntent.id).pipe(take(1)).toPromise();
      this.handlePayment(newResponse);
    } else {
      this.success = true;
    }

  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

}
