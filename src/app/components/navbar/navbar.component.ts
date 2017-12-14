import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public isCollapsed = true;

  constructor() { }

  ngOnInit() {
  }

  collapse(){
	this.isCollapsed = !this.isCollapsed;
	return this.isCollapsed;
  }

}
