import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'coding-challenge-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public heading: string = 'Welcome to stocks!';
  public title: string = 'stocks';

  constructor(private titleValueService: Title){}

  public ngOnInit(): void{
    this.titleValueService.setTitle(this.title);
  }
}
