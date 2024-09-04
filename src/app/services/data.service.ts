import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { User } from '../../../Data Skeleton/User';
import { Subject } from 'rxjs';
import { Submission } from '../../../Data Skeleton/Submission';
import { HttpClient } from '@angular/common/http';

interface submissionsFetchReturn {
  status: string,
  result: Submission[],
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private httpClient: HttpClient) { }

  userOne: User;
  userTwo: User;
  userOneSubmissions: Submission[] = [];
  userTwoSubmissions: Submission[] = [];

  userOneSubject = new Subject<User>();
  userTwoSubject = new Subject<User>();
  userOneSubmissionsSubject = new Subject<Submission[]>();
  userTwoSubmissionsSubject = new Subject<Submission[]>();

  userOne$ = this.userOneSubject.asObservable();
  userTwo$ = this.userTwoSubject.asObservable();
  userOneSubmissions$ = this.userOneSubmissionsSubject.asObservable();
  userTwoSubmissions$ = this.userTwoSubmissionsSubject.asObservable();

  getData(one: User, two: User) {
    console.log('Inside Get Data')
    this.userOne = one;
    this.userTwo = two;
    
    let requestUrl = "https://codeforces.com/api/user.status?handle=";

    let req1 = requestUrl + one.handle;
    let req2 = requestUrl + two.handle;
    
    let userOneObs = this.httpClient.get<submissionsFetchReturn>(req1);
    let userTwoObs = this.httpClient.get<submissionsFetchReturn>(req2);

    userOneObs.subscribe({
      next: (value) => {
        this.userOneSubmissions = value.result;
        this.emitData();
      },
      error: (err) => {
        console.log('Error in fetching user one submissions');
      }
    })

    userTwoObs.subscribe({
      next: (value) => {
        this.userTwoSubmissions = value.result;
        this.emitData();
      },
      error: (err) => {
        console.log('Error in fetching user two submissions');
      }
    })
  }

  emitData() {  
    if (this.userOneSubmissions.length >= 1 && this.userTwoSubmissions.length >= 1) {
      console.log('Data is being emitted by the subject');
      this.userOneSubject.next(this.userOne);
      this.userTwoSubject.next(this.userTwo);
      this.userOneSubmissionsSubject.next(this.userOneSubmissions);
      this.userTwoSubmissionsSubject.next(this.userTwoSubmissions);
    }   
  }
}