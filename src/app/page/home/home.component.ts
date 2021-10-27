import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  pageName: any;

  constructor() { }

  ngOnInit(): void {
    this.pageName = 'product'
  }
  setPage(value: string): void {
    this.pageName = value

  }
}
