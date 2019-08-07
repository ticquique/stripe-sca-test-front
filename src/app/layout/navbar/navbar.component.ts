import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/interfaces/user';
import { UserService } from 'src/app/shared/services/api/user.service';

@Component({
  selector: 'stri-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user$: Observable<IUser>;
  constructor(public userService: UserService) { }

  ngOnInit() {
    this.user$ = this.userService.user$;
  }

}
