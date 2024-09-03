import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProfileOneComponent } from "./components/profile-one/profile-one.component";
import { ProfileTwoComponent } from "./components/profile-two/profile-two.component";
import { CompareComponent } from "./components/compare/compare.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProfileOneComponent, ProfileTwoComponent, CompareComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CF-Profile-Comparison';
}
