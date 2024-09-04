import { Author } from "./Author";
import { Problem } from "./Problem";

export interface Submission {
    id: number,
    contestId: number,
    problem: Problem,
    verdict: string,
    author: Author
}