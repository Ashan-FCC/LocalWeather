var x = document.getElementById("demo");
var currentWeather = "";
var userLocation = "";
var defaultWeather = {
                      "weather" : [{
                        "icon" : "10d", 
                        "main" : "",
                        "description" : "Light Rain"
                        }],
                      "main" : {
                        "temp" : "300.43",
                        "humidity" : "55"
                      },
                      "wind":{
                     "speed":5.1,
                     "deg":210
                      }
                    };

$(document).ready(function() {

  getLocation(getWeather);

  function getLocation() {
  console.log("In the getLocation");
  if (navigator.geolocation) {
    userLocation = navigator.geolocation.getCurrentPosition(showPosition);

  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
  return userLocation;
}

function showPosition(position) {
  var longitude = position.coords.longitude;
  var latitude = position.coords.latitude;
  setUserLocation(longitude,latitude);
  getWeather(longitude, latitude);
  return  position;
}

function setUserLocation(longitude,latitude){
    $.ajax({
    url: "http://maps.googleapis.com/maps/api/geocode/json?latlng="+latitude+","+longitude,
    method: "GET",
    success: function(response) {
      currentWeather = response;
      var jsonString = JSON.stringify(response);
      var result = JSON.stringify(response);
      if(response["status"]==="OK"){
        var results = response["results"];
        results.forEach(getLocality);
      }else{
         $("#location").text("Couldn't get Address");
      }
    },
    error: function(response) {
        $("#location").text("Couldn't get Address");
    }
  });
}
function getLocality(val, ind,arr){
  var types = val["types"];
  for(var i = 0; i< types.length; i++){
    if(types[i]==="locality"){
      $("#location").html(val["formatted_address"]);
      return;
    }
  }
}

function getWeather(longitude, latitude) {
  longitude = longitude.toFixed(6);
  latitude = latitude.toFixed(6);
  $.ajax({
    url: "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=28e6874e972fc7cb18a81eb5ad0ede75",
    method: "GET",
    success: function(response) {
      console.log("Success");
      showWeather(response);
    },
    error: function(response) {
      console.log("Error");
      showWeather(defaultWeather);

    }
  }); //
}

function showWeather(response){
  console.log(JSON.stringify(response));
	var weather = response.weather[0];
	var weatherStats = toCamelCase(weather.description);
  var urlid = weather.icon;
  var iconUrl = "http://openweathermap.org/img/w/"+urlid+".png";
  var icon = "<img src="+iconUrl+ " alt="+weather.main+" width=50px height=50px/>";
  var wind = response.wind.speed;
	$(".description").text(weatherStats);
  var temp = fromKelvinToCelcius(response.main.temp)
	$(".temperature-value").text(temp);
	$(".humidity > span").text(response.main.humidity+" %");
  $(".weather-icon").html(icon);
  $(".wind > span").text(wind+" mph");

}


function fromKelvinToCelcius(temp) {
  return (temp-273).toFixed(2);
}

function convertToCelcius(farenheit){
  var celcius = (farenheit-32)/1.8;
  return celcius;
}

function convertToFarenheit(celcius){
  var farenheit = (celcius*1.8) + 32;
  return farenheit;
}

function toCamelCase(str){
  console.log("Converting to camel case: "+str );
  return str.split(' ').map(function(word){
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

$(".temp-unit").on("click", function(){
    var temp = $(".temperature-value").text();
    var unit = $(".temp-unit").text();
    console.log("Value of temp-unit: "+unit);
    console.log("Value of temp: "+temp);
    if(unit==="° C"){
      $(".temp-unit").html("° F");
      temp = convertToFarenheit(temp);
    }else{
       $(".temp-unit").html("° C");
       temp  = convertToCelcius(temp);
    }
    $(".temperature-value").html(temp.toFixed(2));
})

});

