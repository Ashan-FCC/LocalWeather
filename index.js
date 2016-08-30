var x = document.getElementById("demo");
var currentWeather = "";
var userLocation = "";


$(document).ready(function() {
  getLocation(getWeather);

  function getLocation() {
  console.log("In the getLocation");
  if (navigator.geolocation) {
    userLocation = navigator.geolocation.getCurrentPosition(showPosition);

  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
  console.log("getLocation: " + userLocation);
  console.log("Finishing getLocation");
  return userLocation;
}

function showPosition(position) {
  userLocation = position;
  var longitude = position.coords.longitude;
  var latitude = position.coords.latitude;
  console.log("showPosition: " + userLocation);
  x.innerHTML = "Latitude: " + longitude + "<br>Longitude: " +
    latitude;
  setUserLocation(longitude,latitude);
  getWeather(longitude, latitude);
  return
  position;
}

function setUserLocation(longitude,latitude){
    $.ajax({
    url: "http://maps.googleapis.com/maps/api/geocode/json?latlng="+latitude+","+longitude,
    method: "GET",
    success: function(response) {
      currentWeather = response;
      var jsonString = JSON.stringify(response);
      var result = JSON.stringify(response);
      console.log(result);
      var results = response["results"];
      console.log("Results: "+results);
      results.forEach(getSublocality);
      console.log("Request Success!");
      //console.log(response);
      console.log("In the success func of ajax");
    }
  });
}
function getSublocality(val, ind,arr){
  var types = val["types"];
  for(var i = 0; i< types.length; i++){
    if(types[i]==="sublocality"){
      $("#location").html(val["formatted_address"]);
      return;
    }
  }
}

function getWeather(longitude, latitude) {
  longitude = longitude.toFixed(6);
  latitude = latitude.toFixed(6);
  console.log("long: " + longitude);
  console.log("lat: " + latitude);
  $.ajax({
    url: "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=28e6874e972fc7cb18a81eb5ad0ede75",
    method: "GET",
    success: function(response) {
      currentWeather = response;
      var jsonString = JSON.stringify(response);
      console.log("Request Success!");
      console.log(response);
      showWeather(response);
      console.log("In the success func of ajax");
    }
  }); //
}

function showWeather(response){
	var weather = response.weather[0];
	var weatherStats = response.main;
	$(".description").html(weather.main);
	$(".temperature").html(weatherStats.temp);
	$(".humidity").html(weatherStats.humidity);
	
}



function convertToCelcisu(farenheit){
  var celcius = (farenheit-32)/1.8;
  return celcius;
}

function convertToFarenheit(celcius){
  var farenheit = (celcius*1.8) + 32;
}
});

var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });
}
