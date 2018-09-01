import { Injectable, Inject } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {LOCAL_STORAGE, SESSION_STORAGE, StorageService} from 'angular-webstorage-service';

const STORAGE_KEY = 'searched_cities';
const USER_STORAGE_KEY = 'users';
const USER_SESSION_KEY = 'user';

@Injectable({
  providedIn: 'root'
})

export class WeatherService{
  // https://cors-anywhere.herokuapp.com/
  google_places_api_url = "https://maps.googleapis.com/maps/api/place/autocomplete/json";
  // google_api_key = "AIzaSyCHqR8DqJeSxNYdIPKii2t8pbCZXfmnFkc";
  google_api_key = "AIzaSyDTBQViuLWKP9AYioLH6fKDZuxgZ4r34Xg";
  accu_api_loc_url = "https://dataservice.accuweather.com/locations/v1/cities/autocomplete";
  accu_api_url = "https://dataservice.accuweather.com/currentconditions/v1/";
  // accu_api_key = "T283PUYAAsnzd8V6AfCU6wSDW7ngKhpe";
  accu_api_key = "rUcDJJVG6WAKGxcCih5Q3Hogt226wAar";
  cityName = "";
  storedCities = [];
  storedUsers = [];
  isUser = false;
  weatherData;
  userName = "Def";
  userEmail = "";

  constructor(@Inject(LOCAL_STORAGE) private storage:StorageService,@Inject(SESSION_STORAGE) private userSession:StorageService, private http:HttpClient) { }

  getSessionData(){
    return this.userSession.get(USER_SESSION_KEY) || [];
  }

  clearSession(){
    this.userSession.remove(USER_SESSION_KEY);
  }

  getStoredData():any[]{
    this.storedCities = this.storage.get(STORAGE_KEY) || [];
    var citiesData = [];
    for(let i=0;i<this.storedCities.length;i++){
      if(this.userEmail == this.storedCities[i]['userEmail']){
        citiesData.push(this.storedCities[i]);
      }
    }
    return citiesData;
  }

  storeCities(key,value,id){
    this.storedCities = this.storage.get(STORAGE_KEY) || [];
    this.storedCities.push({
      title:key,
      cityId:id,
      userEmail:this.userEmail,
      data:value
    });
    this.storage.set(STORAGE_KEY, this.storedCities);
  }

  checkLimit(){
    this.storedCities = this.storage.get(STORAGE_KEY) || [];
    var i=0,count=0;
    
    for(i=0;i<this.storedCities.length;i++){
      if(this.getSessionData()['email'] == this.storedCities[i]['userEmail']){
        count++;        
      }
    }

    if(count>=5){
      return true;
    }else{
      return false;
    }
  }

  addUser(data):boolean{
    var stored = false;
    this.storedUsers = this.storage.get(USER_STORAGE_KEY) || [];
    if(data==""){
      return false;
    }
    if(!this.checkIfUserExists(data)){
      this.storedUsers.push(data);
      this.storage.set(USER_STORAGE_KEY,this.storedUsers);
      stored = true;
      this.userSession.set(USER_SESSION_KEY,data);
      this.isUser = true;
      this.userName = data['name'];
      this.userEmail = data['email'];
    }else{
      stored = false;
      alert("You are already registered , please login");
    }
    return stored;
  }

  checkIfUserExists(data):boolean{
    var i = 0;
    var isAvailable = false;
    this.isUser = false;
    this.storedUsers = this.storage.get(USER_STORAGE_KEY) || [];

    for(i=0;i<this.storedUsers.length;i++){
      if(this.storedUsers[i]['email'] == data['email']){
        isAvailable = true;
        this.userName = this.storedUsers[i]['name'];
        this.userEmail = this.storedUsers[i]['email'];
        if((isAvailable) && (this.storedUsers[i]['password'] == data['password'])){
          this.userSession.set(USER_SESSION_KEY, this.storedUsers[i]);
          this.isUser = true;
        }else{
          this.isUser = false;
        }
      }
    }
    return isAvailable;
  }

  cityExists(cityName):boolean{
    var i = 0;
    var isAvailable = false;
    this.storedCities = this.storage.get(STORAGE_KEY) || [];
    for(i=0;i<this.storedCities.length;i++){
      if((this.storedCities[i]['title'] == cityName)&&(this.storedCities[i]['userEmail'] == this.userEmail)){
        isAvailable = true;
        this.weatherData = this.storedCities[i];
        break;
      }else{
        isAvailable = false;
      }
    }
    return isAvailable;
  }

  getData(cityId){    
    const params = new HttpParams().set('apikey',this.accu_api_key);
    return this.http.get(this.accu_api_url+cityId,{params});
  }

  getPreviousData(cityId:number){
    const params = new HttpParams().set('apikey',this.accu_api_key);
    return this.http.get(this.accu_api_url+cityId+"/historical/24",{params});
  }

  getCityDetails(cityName){
    const params = new HttpParams().set('apikey',this.accu_api_key).set('q',cityName);
    return this.http.get(this.accu_api_loc_url,{params});
  }

  getCitiesList(search){
    const params = new HttpParams().set('input',search).set('types',"(cities)").set('key',this.google_api_key);
    return this.http.get(this.google_places_api_url,{params});
  }

}
