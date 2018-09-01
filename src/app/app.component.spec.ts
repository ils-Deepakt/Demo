import { TestBed, async } from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {StorageServiceModule} from 'angular-webstorage-service';
import {HttpClientModule} from '@angular/common/http';
 
import { AppComponent } from './app.component';
import {HeaderComponent} from './header/header.component';
import {HomeComponent} from './home/home.component';
import {CurrentComponent} from './current/current.component';
import {WeatherService} from './weather.service';

describe('AppComponent', () => {
  const ROUTES:Routes = [
    {path:'',component:HomeComponent},
    {path:'current',component:CurrentComponent}
  ];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HeaderComponent,
        CurrentComponent,
        HomeComponent
      ],
      imports: [
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        StorageServiceModule,
        RouterModule.forRoot(ROUTES)
      ],
      providers: [
        WeatherService,
        { provide:APP_BASE_HREF, useValue: '/' }
      ]
    }).compileComponents();
  }));
});
