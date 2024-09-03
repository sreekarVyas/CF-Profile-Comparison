import { EventEmitter, Injectable } from '@angular/core';
import { User } from '../../../User';
import { Subject } from 'rxjs';
import { Submission } from '../../../Submission';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor() { } 

  userOne: User;
  userTwo: User;
  userOneSubmissions: Submission[];
  userTwoSubmissions: Submission[];

  userOneSubject = new Subject<User>();
  userTwoSubject = new Subject<User>();
  userOneSubmissionsSubject = new Subject<Submission[]>();
  userTwoSubmissionsSubject = new Subject<Submission[]>();

  userOne$ = this.userOneSubject.asObservable();
  userTwo$ = this.userTwoSubject.asObservable();
  userOneSubmissions$ = this.userOneSubmissionsSubject.asObservable();
  userTwoSubmissions$ = this.userTwoSubmissionsSubject.asObservable();

  oneSubmitted(userOne: User, userOneSubmissions: Submission[]) {
    this.userOne = userOne;
    console.log('In service : ' + userOneSubmissions)
    this.userOneSubmissions = userOneSubmissions;
    if(this.userOne && this.userTwo) {
      this.userOneSubject.next(this.userOne);
      this.userTwoSubject.next(this.userTwo);
      this.userOneSubmissionsSubject.next(this.userOneSubmissions);
      this.userTwoSubmissionsSubject.next(this.userTwoSubmissions);
    }
  }

  twoSubmitted(userTwo: User, userTwoSubmissions: Submission[]) {
    this.userTwo = userTwo;
    this.userTwoSubmissions = userTwoSubmissions;
    if (this.userTwo && this.userOne) {
      this.userOneSubject.next(this.userOne);
      this.userTwoSubject.next(this.userTwo);
      this.userOneSubmissionsSubject.next(this.userOneSubmissions);
      this.userTwoSubmissionsSubject.next(this.userTwoSubmissions);
    }
  }
}
