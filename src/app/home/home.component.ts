import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Router} from '@angular/router';

import {WeatherService} from '../weather.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  loginForm:FormGroup;
  signUpForm:FormGroup;
  userExists:boolean;

  constructor(private router:Router,private weatherService:WeatherService) { }

  ngOnInit() {
    this.signUpForm = new FormGroup({
      name: new FormControl('',[Validators.required,Validators.pattern('[a-zA-Z][a-zA-Z]+')]),
      email: new FormControl('',[Validators.required,Validators.email]),
      password: new FormControl('',[Validators.required,Validators.minLength(4)])
    });

    this.loginForm = new FormGroup({
      email: new FormControl('',[Validators.required,Validators.email]),
      password: new FormControl('',[Validators.required,Validators.minLength(4)])
    });

    if(this.weatherService.getSessionData()['name']!=undefined){
      this.weatherService.isUser = true;
      this.weatherService.userName = this.weatherService.getSessionData()['name']
      this.weatherService.userEmail = this.weatherService.getSessionData()['email']
      this.router.navigate(['./current']);
    }else{
      this.weatherService.isUser = false;
      this.weatherService.userName = undefined;
      this.weatherService.userEmail = undefined;
    }
  }

  login(){
    this.userExists = this.weatherService.checkIfUserExists(this.loginForm.value);
    if(this.userExists && (this.weatherService.isUser)){
      this.router.navigate(['./current']);
    }else{
      this.router.navigate(['./']);
      alert("Incorrect credentials")
    }
  }

  signUp(){
    this.signUpForm.value['name'] = this.signUpForm.value['name'].toLowerCase();
    if(this.weatherService.addUser(this.signUpForm.value)){
      this.router.navigate(['./current']);
    }else{
      this.weatherService.isUser = false;
      this.router.navigate(['./']);
    }
  }

}
