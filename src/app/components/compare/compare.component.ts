import { Component, OnInit } from '@angular/core';
import { User } from '../../../../User'
import { DataService } from '../../services/data.service';
import { Submission } from '../../../../Submission';
type ProblemIdentifier = [number, string]



const calculateProblemFrequency = (submissions: Submission[]): { [difficulty: string]: number } => {
  const problemRatingFrequency: { [difficulty: string]: number } = {};
  const seenProblemIds: Map<ProblemIdentifier, boolean> = new Map();
  for(let submission of submissions) {
    // if(seenProblemIds.has([subim]))
    let contestId = submission.problem.contestId;
    let index = submission.problem.index;

    if(seenProblemIds.has([contestId, index])) {
      continue;
    }
    if(submission.verdict != "OK") {
      continue;
    }

    seenProblemIds.set([contestId, index], true);
    let rating = submission.problem.rating;

    if(rating) {
      if (problemRatingFrequency[rating]) {
        problemRatingFrequency[rating] += 1
      }
      else {
        problemRatingFrequency[rating] = 1
      }
    }
    
  }

  return problemRatingFrequency;
}

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [],
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.css'
})
export class CompareComponent implements OnInit {
  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  userOne: User;
  userTwo: User;
  userOneSubmissions: Submission[] = [];
  userTwoSubmissions: Submission[] = [];

  userOneProblemRatingFrequency = {}
  userTwoProblemRatingFrequency = {}

  readyToCompare: boolean = false;

  constructor(private dataService: DataService) {}
  ngOnInit() {
    this.dataService.userOne$.subscribe(
      {
        next: (data) => {
          console.log('User One recieved from data service');
          console.log(data);
          this.userOne = data;
        },
        error: (err) => {
          console.log('User One not recieved from data service ' + err);
        }
      }
    )
    this.dataService.userTwo$.subscribe(
      {
        next: (data) => {
          console.log('User Two recieved from data service');
          console.log(data);
          this.userTwo = data;
        },
        error: (err) => {
          console.log('User Two not recieved from data service ' + err);
        }
      }
    ) 
    this.dataService.userOneSubmissions$.subscribe({
      next: (data) => {
        console.log('User One submissions recieved from data service');
        this.userOneSubmissions = data;
        console.log(data);
        this.checkToCompare();
      },
      error: (err) => {
        console.log('User One Submissions Not recieved from data service ' + err);
      }
    })
    this.dataService.userTwoSubmissions$.subscribe({
      next: (data) => {
        console.log('User Two submissions recieved from data service');
        this.userTwoSubmissions = data;
        console.log(data);
        this.checkToCompare();
      },
      error: (err) => {
        console.log('User Two Submissions Not recieved from data service ' + err);
      }
    })
    if(this.userOne && this.userTwo) {
      this.userOneProblemRatingFrequency = calculateProblemFrequency(this.userOneSubmissions);
      this.userTwoProblemRatingFrequency = calculateProblemFrequency(this.userTwoSubmissions);

      console.log(this.userOneProblemRatingFrequency);

      this.readyToCompare = true;
    }
  }
  private checkToCompare() {
    if(this.userOneSubmissions.length >= 1 && this.userTwoSubmissions.length >=1) {
      this.userOneProblemRatingFrequency = calculateProblemFrequency(this.userOneSubmissions);
      this.userTwoProblemRatingFrequency = calculateProblemFrequency(this.userTwoSubmissions);
      this.readyToCompare = true;
    }
  }
}
