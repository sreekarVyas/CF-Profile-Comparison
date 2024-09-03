import { Component } from '@angular/core';
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
  selector: 'app-profile-one',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile-one.component.html',
  styleUrl: './profile-one.component.css'
})
export class ProfileOneComponent {
  constructor(private dataService: DataService, private httpClient: HttpClient) { }
  private ratingFetchApi = "https://codeforces.com/api/user.info?handles=";
  private submissionsFetchApi = "https://codeforces.com/api/user.status?handle=";

  handle: string;
  userOne: User = {handle: ''};
  submissions: Submission[];
  wrongHandle: boolean = false;

  onClick() {
    let requestUrl = this.ratingFetchApi + this.handle;
    let ratingData = this.httpClient.get<ratingFetchReturn>(requestUrl);

    let submissionsRequestUrl = this.submissionsFetchApi + this.handle;
    let submissionsData = this.httpClient.get<submissionsFetchReturn>(submissionsRequestUrl);

    ratingData.subscribe({
      next: (value) => {
        console.log('User 1 rating details recieved')
        console.log(this.handle)
        this.wrongHandle = false;
        this.userOne.handle = this.handle;
        this.userOne.rating = value.result[0].rating;
        this.userOne.maxRating = value.result[0].maxRating;
        this.userOne.rank = value.result[0].rank;
        this.userOne.maxRank = value.result[0].maxRank;
      },
      error: (err) => {
        console.log('Error in recieving User 1 rating details ' + err);
        this.wrongHandle = true;
      },
    })

    submissionsData.subscribe({
      next: (value) => {
        console.log('Recieved User 1 Submissions')
        this.submissions = value.result;
        console.log(this.submissions);

        if ((this.userOne) && (this.submissions.length >= 1)) {
          console.log('before sending this to service ' + this.submissions);
          this.dataService.oneSubmitted(this.userOne, this.submissions);
        }
       
      },
      error: (err) => {
        console.log('Error in recieving User 1 Submissions' + err)
      }
    })
  }
}
