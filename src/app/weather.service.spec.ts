import { TestBed, inject } from '@angular/core/testing';
import {StorageServiceModule} from 'angular-webstorage-service';
import {HttpClientModule} from '@angular/common/http';

import { WeatherService } from './weather.service';

var s;
describe('WeatherService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WeatherService
      ],
      imports: [
        StorageServiceModule,
        HttpClientModule
      ]
    });
  });

  beforeAll(inject([WeatherService], (service: WeatherService) =>{
    s = service;
  }));

  beforeAll((done)=>{
    s.getData(204411).subscribe(data=>{
      if(data!=''){
        s.weatherData = data;
      }
      done()
    },error=>{
      s.weatherData = error;
    }
    );
  });

  it('cityExists returns false',inject([WeatherService], (service: WeatherService) =>{
    expect(service.cityExists('')).toBeFalsy();
  }));

  it('getData returns data',()=>{  
    expect(s.weatherData).toBeDefined();
    expect(s.weatherData).not.toBe('');
  });

  xit('addUser returns true',()=>{
    var email  = "dfg@dfg";
    var form_data = {'name':'sdsd','email':email,'password':'asdf'};
    expect(s.addUser(form_data)).toBeTruthy();
  });

  it('addUser returns false on empty value',()=>{
    var form_data = "";
    expect(s.addUser(form_data)).toBeFalsy();
  });

});
