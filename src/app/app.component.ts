import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CompareComponent } from "./components/compare/compare.component";
import { UsersFormComponent } from "./components/users-form/users-form.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CompareComponent, UsersFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CF-Profile-Comparison';
}
