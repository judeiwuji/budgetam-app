import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.css'],
})
export class MainFooterComponent implements OnInit {
  public year = new Date().getFullYear();

  constructor() {}

  ngOnInit(): void {}
}
