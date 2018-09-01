import { Component, OnInit } from '@angular/core';
import {WeatherService} from '../weather.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Chart } from 'chart.js';
import {Router} from '@angular/router';

@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.css']
})

export class CurrentComponent implements OnInit {
  weatherData:Object = "";
  reportAvailable:boolean = false;
  form:FormGroup;
  error = 200;
  clicked:boolean = false;
  showPreviousData:boolean = false;
  previousData:Object = "";
  date:string[] = [];
  temp:string[] = [];
  chart = [];
  cityGot = "";
  cityId = 0;
  weatherIcon;
  temperature;
  weatherText;
  cityList = [];
  hasPrevData:boolean = false;
  searching = false;

  optionsOnError:string[] = ['Check if the city name is correct','Try to search without country name/id','Try searching for other city'];

  constructor(private router:Router,private weatherService:WeatherService) { }

  ngOnInit() {
    if(!this.weatherService.isUser){
      this.router.navigate(['./']);
    }

    this.form = new FormGroup({
      cityName: new FormControl('',[Validators.required])
    });
  }

  getWeatherService(){
    return this.weatherService;
  }

  getCityName(query){
    var search = query.target.value;
    if(search.length>3){
      this.searching = true;
      this.weatherService.getCitiesList(search).subscribe((data:string)=>{
        var size = 0;
        var city = "";
        var country = "";
        this.cityList = [];
        for(let i=0;i<data['predictions'].length;i++){
          var cities = data['predictions'][i]['terms'];
          size = cities.length
          city = cities[0]['value'];
          country = cities[size-1]['value'];
          var value = city+","+country;
          if(this.cityList.indexOf(value)==-1){
            this.cityList.push(value);
          }
        }
        this.searching = false;
      },
      error=>{
        this.error = error;
        console.log(error);      
        this.searching = false;
      });
    }
  }

  getCityData(city){
    this.reportAvailable = true;
    this.clicked = false;
    this.weatherData = city['data'];
    this.weatherIcon = this.weatherData[0]['WeatherIcon'];
    this.temperature = this.weatherData[0]['Temperature']['Metric']['Value'];
    this.weatherText = this.weatherData[0]['WeatherText'];
    this.cityGot = city['title'];
    this.cityId = city['cityId'];
    this.showPreviousData = true;
    this.hasPrevData = false;
  }

  getReport(){

    if(this.weatherService.getSessionData()['name']==undefined){
      alert("Please login first to get report")
      this.router.navigate(['./']);
      return;
    }

    var query="";
    var searched=this.form.value['cityName'];
    var indexOfComma = searched.indexOf(',');

    if(indexOfComma != -1){
      query = searched.substring(0,indexOfComma);
    }else{
      query = searched;
    } 

    this.showPreviousData = false;
    this.previousData = "";
    this.reportAvailable = false;
    this.hasPrevData = false;
    this.clicked = true;
    
    if(this.weatherService.checkLimit()){
      this.clicked = false;
      alert("Search limit reached")
    }else{
      this.weatherService.getCityDetails(query).subscribe((data:string)=>{
        var city="",country="";
        if(indexOfComma != -1){
          city = searched.substring(0,indexOfComma);
          country = searched.substring(indexOfComma+1,searched.length);
        }
        if(data.length!=0){
          var index = 0;
          if(country!=""){
            index = -1;
            for(let i=0;i<data.length;i++){
              if((country == data[i]['Country']['LocalizedName']) || (country == data[i]['Country']['ID'])){
                index = i;
                break;
              }
            }
            if(index == -1){
              this.error = 404;
              return;
            }
          }
          this.cityId = data[index]['Key'];
          this.cityGot = data[index]['LocalizedName']+","+data[index]['Country']['LocalizedName'];
          if(this.weatherService.cityExists(this.cityGot)){
            this.getCityData(this.weatherService.weatherData);
          }else{
            this.weatherService.getData(this.cityId).subscribe((data)=>{
              this.weatherData = data;
              this.weatherIcon = this.weatherData[index]['WeatherIcon'];
              this.temperature = this.weatherData[index]['Temperature']['Metric']['Value'];
              this.weatherText = this.weatherData[index]['WeatherText'];
              this.weatherService.storeCities(this.cityGot, this.weatherData,this.cityId);
              this.clicked = false;
              this.reportAvailable = true;
              this.showPreviousData = true;
            },
            error=>{
              this.error = error;
              console.log(error);
              this.reportAvailable = false;
              this.showPreviousData = false;
            });
          }
        }else{
          this.error=404;
          console.log(this.error);
        }
      },
      error=>{
        this.error = error;
        console.log(error);      
      });
    }
  }

  calculateTime(ms):string{
    return new Date(ms * 1000).toLocaleTimeString();
  }

  loadPrevData(){
    this.previousData = "";
    if(this.weatherService.getSessionData()['name']==undefined){
      alert("Please login first to get report")
      this.router.navigate(['./']);
      return;
    }
    this.getPrevData();
  }

  getPrevData(){
    this.hasPrevData = true;
    this.weatherService.getPreviousData(this.cityId).subscribe((data)=>{
      this.previousData = data;
      this.showChart();
    },
    error=>{
      this.error = error;
      console.log(error);
    });
  }

  showChart(){
    var i = 0;
    for(i=0;i<24;i++){
      this.date[i] = this.calculateTime(this.previousData[i]['EpochTime']);
      this.temp[i] = this.previousData[i]['Temperature']['Metric']['Value'];
    }

    var canvasId = document.getElementById("canvas");
    this.chart = new Chart(canvasId, {
      type: 'line',
      data: {
        labels: this.date,
        datasets: [
          { 
            data: this.temp,
            borderColor: "#3cba9f",
            fill: false
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Time in hours (IST)',
              fontSize:15
            }
          }],
          yAxes: [{
            ticks: {
              min:0,
              max:50,
              stepSize:5
            },
            scaleLabel: {
              display: true,
              labelString: 'Temperature in °C',
              fontSize:15
            }
          }],
        }
      }
    });
  }

}

export interface CurrentWeatherData{
  weatherIcon;
  temperature;
  weatherText;
}

