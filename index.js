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
  console.log("showPosition: " + userLocation);
  x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " +
    position.coords.longitude;
  getWeather(position.coords.longitude, position.coords.latitude);
  return
  position;
}

function getWeather(longitude, latitude) {
  longitude = longitude.toFixed(2);
  latitude = latitude.toFixed(2);
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


});

