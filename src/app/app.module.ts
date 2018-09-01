import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {StorageServiceModule} from 'angular-webstorage-service';
import {Routes, RouterModule} from '@angular/router';

import { AppComponent } from './app.component';
import { CurrentComponent } from './current/current.component';
import {WeatherService} from './weather.service';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';

const ROUTES:Routes = [
  {path:'',component:HomeComponent},
  {path:'current',component:CurrentComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    CurrentComponent,
    HomeComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    StorageServiceModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [WeatherService],
  bootstrap: [AppComponent]
})
export class AppModule { }
