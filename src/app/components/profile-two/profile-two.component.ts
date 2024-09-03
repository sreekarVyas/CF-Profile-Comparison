import { Component, OnInit } from '@angular/core';
import { User } from '../../../../User'
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { HttpClient } from '@angular/common/http';
import { Submission } from '../../../../Submission';

interface ratingFetchReturn {
  status: string, 
  result: User[];
}

interface submissionsFetchReturn {
  status: string,
  result: Submission[],
}

@Component({
  selector: 'app-profile-two',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile-two.component.html',
  styleUrl: './profile-two.component.css'
})
export class ProfileTwoComponent {
  constructor(private dataService: DataService, private httpClient: HttpClient) {}
  private ratingFetchApi = "https://codeforces.com/api/user.info?handles=";
  private submissionsFetchApi = "https://codeforces.com/api/user.status?handle="; 

  handle: string;
  userTwo: User = {handle : ''};
  submissions: Submission[];
  wrongHandle: boolean = false;

  onClick() {
    let ratingRequestUrl = this.ratingFetchApi + this.handle;
    console.log('Handle : ' + this.handle)
    let ratingData = this.httpClient.get<ratingFetchReturn>(ratingRequestUrl);

    let submissionsRequestUrl = this.submissionsFetchApi + this.handle;
    let submissionsData = this.httpClient.get<submissionsFetchReturn>(submissionsRequestUrl);

    ratingData.subscribe({
      next: (value) => {
        console.log(value)
        console.log('User 2 rating details recieved')
        this.wrongHandle = false;
        this.userTwo.handle = this.handle;
        this.userTwo.rating = value.result[0].rating;
        this.userTwo.maxRating = value.result[0].maxRating;
        this.userTwo.rank = value.result[0].rank;
        this.userTwo.maxRank = value.result[0].maxRank;
      },  
      error: (err) => {
        console.log('Error in recieving User 2 rating details '+ err);
        this.wrongHandle = true;
      },
    })      

    submissionsData.subscribe({
      next: (value) => {
        console.log('Recieved User 2 Submissions')
        this.submissions = value.result;

        if ((this.userTwo) && (this.submissions.length >= 1)) {
          console.log('before sending this to service ' + this.submissions);
          this.dataService.twoSubmitted(this.userTwo, this.submissions);
        }

      },
      error: (err) => {
        console.log('Error in recieving User 2 Submissions')
      }
    })
  }
}
