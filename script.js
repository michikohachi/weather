// Base URL: https://api.openweathermap.org/data/2.5/
const apiKey = API_KEY;


// Fetch current weather, forecast, and air pollution

function getWeather() {
  const city = document.getElementById("city").value.trim();
  const result = document.getElementById("result");

  if (city === "") {
    result.innerHTML = "❗ Please enter a city name.";
    return;
  }

  

  // CURRENT WEATHER

  fetch(currentUrl)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        result.innerHTML = "❌ City not found.";
        return;
      }

      applyTheme(data.weather[0].icon);

      const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      // Get coordinates for pollution API
      const lat = data.coord.lat;
      const lon = data.coord.lon;

      result.innerHTML = `
        <h3>${data.name}, ${data.sys.country}</h3>
        <img src="${iconUrl}" class="weather-icon">
        <p class="temp">${data.main.temp}°C</p>
        <p>☁️ ${data.weather[0].description}</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>

        <p id="pollution">🌫️ Air Quality: Loading...</p>

        <h4>5-Day Forecast</h4>
        <div id="forecast" class="forecast"></div>
      `;

      // AIR POLLUTION (3rd API)

      const pollutionUrl =
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

      fetch(pollutionUrl)
        .then(res => res.json())
        .then(pollutionData => {
          const aqi = pollutionData.list[0].main.aqi;
          const pollutionText = document.getElementById("pollution");

          pollutionText.innerHTML = `🌫️ Air Quality: ${getAQIDescription(aqi)}`;
        });
    });


  // 5-DAY FORECAST

  fetch(forecastUrl)
    .then(res => res.json())
    .then(data => {
      const forecastDiv = document.getElementById("forecast");
      forecastDiv.innerHTML = "";

      for (let i = 0; i < data.list.length; i += 8) {
        const day = data.list[i];
        const date = new Date(day.dt_txt).toDateString();
        const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

        forecastDiv.innerHTML += `
          <div class="forecast-item">
            <p>${date}</p>
            <img src="${icon}">
            <p>${day.main.temp}°C</p>
          </div>
        `;
      }
    })
    .catch(err => {
      console.error(err);
    });
}


// Convert AQI number to readable text

function getAQIDescription(aqi) {
  switch (aqi) {
    case 1: return "Good 😊";
    case 2: return "Fair 🙂";
    case 3: return "Moderate 😐";
    case 4: return "Poor 😷";
    case 5: return "Very Poor 🤢";
    default: return "Unknown";
  }
}


// Day / Night Theme Switch

function applyTheme(icon) {
  const body = document.body;

  if (icon.includes("n")) {
    body.classList.add("night");
  } else {
    body.classList.remove("night");
  }
}

// ======================================
// OpenWeather API Documentation
// Base URL: https://api.openweathermap.org/data/2.5/
//
// Required Parameters:
// q      - City name entered by the user (e.g., "Manila")
// units  - Measurement system (metric = Celsius)
// appid  - API key used for authentication
// ======================================
