import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
import { By, BrowserModule } from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {StorageServiceModule} from 'angular-webstorage-service';
import {HttpClientModule} from '@angular/common/http';

import { HomeComponent } from '../home/home.component';
import { CurrentComponent } from './current.component';
import { WeatherService } from '../weather.service';

describe('CurrentComponent', () => {
  let component: CurrentComponent;
  let fixture: ComponentFixture<CurrentComponent>;

  beforeEach(async(() => {
    const ROUTES:Routes = [
      {path:'',component:HomeComponent},
      {path:'current',component:CurrentComponent}
    ];
    TestBed.configureTestingModule({
      declarations: [ 
        CurrentComponent,
        HomeComponent
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
    fixture = TestBed.createComponent(CurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('getReport works', async(()=>{
    spyOn(component, 'getReport');
    expect(component.getReport).toHaveBeenCalledTimes(0);
    component.form.value['cityName'] = "indore";
    component.getReport();
    expect(component.weatherData).toEqual('');
  }));

  it('getCityName returns false when length of query is less than 3', async(()=>{
    var query = {'target':{'value':'ds'}};
    component.getCityName(query);
    expect(component.searching).toBeFalsy();
  }));

});
