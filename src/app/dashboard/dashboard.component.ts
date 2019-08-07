import { Component, OnInit } from '@angular/core';
import { PaymentsService, PaymentSetupIntent } from '../shared/services/api/payments.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'stri-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
