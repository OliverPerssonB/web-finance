import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {
  page = {
    title: 'Welcome to !Avanza',
    subtitle: 'Get a grip on your stocks!',
    content: 'Use the overview to scroll amongst indices and use the chart to see a graph over picked stock. ',
    image: 'assets/backgroundd.jpg'
  };
  constructor() { }

  ngOnInit(): void {
  }

}
