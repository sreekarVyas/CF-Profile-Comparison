import { Component, OnInit } from '@angular/core';
import { User } from '../../../../Data Skeleton/User'
import { DataService } from '../../services/data.service';
import { Submission } from '../../../../Data Skeleton/Submission';
type ProblemIdentifier = [number, string]

const calculateProblemFrequencyPerRating = (submissions: Submission[]): { [difficulty: string]: number } => {
  const problemRatingFrequency: { [difficulty: string]: number } = {};
  const seenProblemIds: Map<ProblemIdentifier, boolean> = new Map();
  for (let submission of submissions) {

    let contestId = submission.problem.contestId;
    let index = submission.problem.index;

    if (seenProblemIds.has([contestId, index])) {
      continue;
    }
    if (submission.verdict != "OK") {
      continue;
    }

    seenProblemIds.set([contestId, index], true);
    let rating = submission.problem.rating;

    if (rating) {
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

const calculateProblemFrequencyPerTag = (submissions: Submission[]): { [tag: string]: number } => {
  const problemTagFrequency: { [tag: string]: number } = {};
  const seenProblemIds: Map<ProblemIdentifier, boolean> = new Map();
  for (let submission of submissions) {

    let contestId = submission.problem.contestId;
    let index = submission.problem.index;

    if (seenProblemIds.has([contestId, index])) {
      continue;
    }
    if (submission.verdict != "OK") {
      continue;
    }

    seenProblemIds.set([contestId, index], true);
    // let rating = submission.problem.rating;
    let tags = submission.problem.tags;

    if (tags) {
      for (let tag of tags) {
        if (problemTagFrequency[tag]) {
          problemTagFrequency[tag] += 1
        }
        else {
          problemTagFrequency[tag] = 1
        }
      }
    }
  }
  return problemTagFrequency;
}



const calculateRatedContests = (submissions: Submission[]): number => {
  let seenContests = []
  for (let item of submissions) {
    if (item.author.participantType == "CONTESTANT") {
      if (seenContests.includes(item.author.contestId)) {
        continue;
      }
      seenContests.push(item.author.contestId);
    }
  }
  return seenContests.length;
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

  difficulties: number[] = []
  mergedTags: string[] = []


  userOneProblemRatingFrequency = {}
  userTwoProblemRatingFrequency = {}

  userOneProblemTagFrequency = {}
  userTwoProblemTagFrequency = {}

  userOneRatedContests: number;
  userTwoRatedContests: number;

  readyToCompare: boolean = false;

  constructor(private dataService: DataService) { }
  ngOnInit() {
    let current = 800;
    while (current <= 3500) {
      this.difficulties.push(current);
      current += 100;
    }

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
  }
  private checkToCompare() {
    if (this.userOneSubmissions.length >= 1 && this.userTwoSubmissions.length >= 1) {
      this.userOneProblemRatingFrequency = calculateProblemFrequencyPerRating(this.userOneSubmissions);
      this.userTwoProblemRatingFrequency = calculateProblemFrequencyPerRating(this.userTwoSubmissions);
      this.userOneRatedContests = calculateRatedContests(this.userOneSubmissions)
      this.userTwoRatedContests = calculateRatedContests(this.userTwoSubmissions)
      this.userOneProblemTagFrequency = calculateProblemFrequencyPerTag(this.userOneSubmissions);
      this.userTwoProblemTagFrequency = calculateProblemFrequencyPerTag(this.userTwoSubmissions);
      
      for (let tag of Object.keys(this.userOneProblemTagFrequency)) {
        if (!this.mergedTags.includes(tag)) {
          this.mergedTags.push(tag);
        }
      }
      for (let tag of Object.keys(this.userTwoProblemTagFrequency)) {
        if (!this.mergedTags.includes(tag)) {
          this.mergedTags.push(tag);
        }
      }
      this.readyToCompare = true;
    }
  }
}