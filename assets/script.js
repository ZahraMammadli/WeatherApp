// Set global variables, including Open Weather Maps API Key
var owmAPI = "66535f8ed119f4412dae494719eaa500";
var currentCity = "";
var lastCity = "";

var handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};

// Get and display the current conditions
var getCurrentConditions = (event) => {
  let city = $("#search-city").val();
  currentCity = $("#search-city").val();
  let queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial" +
    "&APPID=" +
    owmAPI;
  fetch(queryURL)
    .then(handleErrors)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      saveCity(city);
      $("#search-error").text("");
      let currentWeatherIcon =
        "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
      let currentTimeUTC = response.dt;
      let currentTimeZoneOffset = response.timezone;
      let currentTimeZoneOffsetHours = currentTimeZoneOffset / 60 / 60;
      let currentMoment = moment
        .unix(currentTimeUTC)
        .utc()
        .utcOffset(currentTimeZoneOffsetHours);
      renderCities();
      getFiveDayForecast(event);
      $("#header-text").text(response.name);
      let currentWeatherHTML = `
            <h3>${response.name} ${currentMoment.format(
        "(MM/DD/YY)"
      )}<img src="${currentWeatherIcon}"></h3>
            <ul class="list-unstyled">
                <li>Temperature: ${response.main.temp}&#8457;</li>
                <li>Humidity: ${response.main.humidity}%</li>
                <li>Wind Speed: ${response.wind.speed} mph</li
            </ul>`;
      // Append results to the DOM
      $("#current-weather").html(currentWeatherHTML);
      let latitude = response.coord.lat;
      let longitude = response.coord.lon;
    });
};

// get five days forecats
var getFiveDayForecast = (event) => {
  let city = $("#search-city").val();
  let queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial" +
    "&APPID=" +
    owmAPI;
  // Fetch from API
  fetch(queryURL)
    .then(handleErrors)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      let fiveDayForecastHTML = `
        <h2>5-Day Forecast:</h2>
        <div id="fiveDayForecastUl" class="d-inline-flex flex-wrap ">`;
      for (let i = 0; i < response.list.length; i++) {
        let dayData = response.list[i];
        let dayTimeUTC = dayData.dt;
        let timeZoneOffset = response.city.timezone;
        let timeZoneOffsetHours = timeZoneOffset / 60 / 60;
        let thisMoment = moment
          .unix(dayTimeUTC)
          .utc()
          .utcOffset(timeZoneOffsetHours);
        let iconURL =
          "https://openweathermap.org/img/w/" +
          dayData.weather[0].icon +
          ".png";
        if (
          thisMoment.format("HH:mm:ss") === "11:00:00" ||
          thisMoment.format("HH:mm:ss") === "12:00:00" ||
          thisMoment.format("HH:mm:ss") === "13:00:00"
        ) {
          fiveDayForecastHTML += `
                <div class="weather-card card m-2 p0">
                    <ul class="list-unstyled p-3">
                        <li>${thisMoment.format("MM/DD/YY")}</li>
                        <li class="weather-icon"><img src="${iconURL}"></li>
                        <li>Temp: ${dayData.main.temp}&#8457;</li>
                        <br>
                        <li>Humidity: ${dayData.main.humidity}%</li>
                    </ul>
                </div>`;
        }
      }
      fiveDayForecastHTML += `</div>`;
      $("#five-day-forecast").html(fiveDayForecastHTML);
    });
};

//  save the city to localStorage
var saveCity = (newCity) => {
  let cityExists = false;
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage["cities" + i] === newCity) {
      cityExists = true;
      break;
    }
  }
  if (cityExists === false) {
    localStorage.setItem("cities" + localStorage.length, newCity);
  }
};
var renderCities = () => {
  $("#city-results").empty();
  if (localStorage.length === 0) {
    if (lastCity) {
      $("#search-city").attr("value", lastCity);
    } else {
      $("#search-city").attr("value", "Austin");
    }
  } else {
    let lastCityKey = "cities" + (localStorage.length - 1);
    lastCity = localStorage.getItem(lastCityKey);
    $("#search-city").attr("value", lastCity);
    for (let i = 0; i < localStorage.length; i++) {
      let city = localStorage.getItem("cities" + i);
      let cityEl;
      if (currentCity === "") {
        currentCity = lastCity;
      }
      if (city === currentCity) {
        cityEl = `<button type="button" class="list-group-item list-group-item-action active">${city}</button></li>`;
      } else {
        cityEl = `<button type="button" class="list-group-item list-group-item-action">${city}</button></li>`;
      }
      $("#city-results").prepend(cityEl);
    }
  }
};

$("#search-button").on("click", (event) => {
  event.preventDefault();
  currentCity = $("#search-city").val();
  getCurrentConditions(event);
});

$("#city-results").on("click", (event) => {
  event.preventDefault();
  $("#search-city").val(event.target.textContent);
  currentCity = $("#search-city").val();
  getCurrentConditions(event);
});

$("#clear-storage").on("click", (event) => {
  localStorage.clear();
  renderCities();
});

// Render cities
renderCities();

getCurrentConditions();
