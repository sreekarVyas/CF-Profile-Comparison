import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../../Data Skeleton/User';
import { DataService } from '../../services/data.service';

interface ratingFetchReturn {
  status: string,
  result: User[];
}

@Component({
  selector: 'app-users-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './users-form.component.html',
  styleUrl: './users-form.component.css'
})
export class UsersFormComponent {
  constructor(private httpClient: HttpClient, private dataService: DataService) {}
  handleOne: string;
  handleTwo: string;
  userOne: User = {handle: ''};
  userTwo: User = {handle: ''};
  wrongHandleOne: boolean = false;
  wrongHandleTwo: boolean = false;

  verifyHandle = (handle: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      let requestUrl = "https://codeforces.com/api/user.info?handles=" + handle;
      let obs = this.httpClient.get<ratingFetchReturn>(requestUrl);

      obs.subscribe({
        next: (value) => {
          if (value.result[0].handle == this.handleOne) {
            this.wrongHandleOne = false;
            this.userOne.handle = handle;
            this.userOne.rating = value.result[0].rating;
            this.userOne.maxRating = value.result[0].maxRating;
            this.userOne.rank = value.result[0].rank;
            this.userOne.maxRank = value.result[0].maxRank;
          }
          if (value.result[0].handle == this.handleTwo) {
            this.wrongHandleTwo = false;
            this.userTwo.handle = handle;
            this.userTwo.rating = value.result[0].rating;
            this.userTwo.maxRating = value.result[0].maxRating;
            this.userTwo.rank = value.result[0].rank;
            this.userTwo.maxRank = value.result[0].maxRank;
          }
          resolve();
        },
        error: (err) => {
          console.log('Error in getting handles data ' + err);
          if(handle == this.handleOne) {
            this.wrongHandleOne = true;
          }
          if(handle == this.handleTwo){
            this.wrongHandleTwo = true;
          }
          reject(err);
        }
      });
    });
  }



  async handleSubmit() {
    // verifying handles exist or not
    console.log('1--------------1')
    await this.verifyHandle(this.handleOne)
    await this.verifyHandle(this.handleTwo)
     
       
    console.log('3--------------3')
    if(!this.wrongHandleOne && !this.wrongHandleTwo) {
      console.log('Before sending : ')
      console.log(this.userOne);
      console.log(this.userTwo);
      console.log('4--------------4')
      this.dataService.getData(this.userOne, this.userTwo);
    }
  }
}
