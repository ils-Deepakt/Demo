import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {WeatherService} from '../weather.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router:Router,private weatherService:WeatherService) { }

  ngOnInit() {
  }

  getWeatherService(){
    return this.weatherService;
  }

  signOut(){
    this.weatherService.isUser = false;
    this.weatherService.clearSession();
    this.router.navigate(['./']);
  }

}
