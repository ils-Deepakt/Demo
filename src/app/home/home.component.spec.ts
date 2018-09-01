import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {StorageServiceModule} from 'angular-webstorage-service';
import {HttpClientModule} from '@angular/common/http';

import { HomeComponent } from './home.component';
import { WeatherService } from '../weather.service';
import { CurrentComponent } from '../current/current.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    const ROUTES:Routes = [
      {path:'',component:HomeComponent},
      {path:'current',component:CurrentComponent}
    ];
    TestBed.configureTestingModule({
      declarations: [ 
        HomeComponent,
        CurrentComponent
      ],
      imports: [
        BrowserModule,
        FormsModule,
        StorageServiceModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterModule.forRoot(ROUTES)
      ],
      providers: [
        WeatherService,
        { provide:APP_BASE_HREF, useValue: '/' }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Registration form should be invalid', async(()=>{
    component.signUpForm.controls['name'].setValue('');
    component.signUpForm.controls['email'].setValue('');
    component.signUpForm.controls['password'].setValue('');
    expect(component.signUpForm.valid).toBeFalsy();
  }));

  it('Registration form should be valid', async(()=>{
    component.signUpForm.controls['name'].setValue('fsdf');
    component.signUpForm.controls['email'].setValue('dfg@dfg');
    component.signUpForm.controls['password'].setValue('123456');
    expect(component.signUpForm.valid).toBeTruthy();
  }));

  it('login form should be invalid', async(()=>{
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');
    expect(component.loginForm.valid).toBeFalsy();
  }));

  it('Login form should be valid', async(()=>{
    component.loginForm.controls['email'].setValue('demo@demo');
    component.loginForm.controls['password'].setValue('123456');
    expect(component.loginForm.valid).toBeTruthy();
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');
  }));

  it('login returns true if user exists', async(()=>{
    component.loginForm.controls['email'].setValue('dfg@dfg');
    component.loginForm.controls['password'].setValue('asdf');
    component.login();
    expect(component.userExists).toBeTruthy();
  }));

});
