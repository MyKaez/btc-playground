import { Component, Input, OnInit } from '@angular/core';
import { CardSubtitleDirective } from '@coreui/angular';
import { Observable, tap } from 'rxjs';
import { UserCardProps } from './user-cards-props';

@Component({
  selector: 'app-user-cards',
  templateUrl: './user-cards.component.html',
  styleUrls: ['./user-cards.component.scss']
})
export class UserCardsComponent implements OnInit {
  @Input("users") users$!: Observable<UserCardProps[]>;

  constructor() { }

  ngOnInit(): void {
    console.log("card constructor", this.users$);
  }

  test$ = this.users$.pipe(tap(user => console.log("user cards", user)));
}
