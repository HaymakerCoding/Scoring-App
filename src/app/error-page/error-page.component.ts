import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {

  error: string;

  constructor() { }

  ngOnInit(): void {
    this.error = localStorage.getItem('error');
    console.error(localStorage.getItem('fullError'));
  }

}
