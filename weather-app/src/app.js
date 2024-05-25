const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const day = days[date.getDay()];
  return `${day} ${formatHours(timestamp)}`;
};

const formatHours = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const updateWeatherDetails = (data) => {
  document.querySelector("#city").textContent = data.name;
  document.querySelector("#date").textContent = formatDate(data.dt * 1000);
  document.querySelector("#weather-description").textContent =
    data.weather[0].description;
  const weatherIcon = document.querySelector("#weather-icon");
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
  );
  weatherIcon.setAttribute("alt", data.weather[0].description);
  updateTemperature(data.main.temp);
  document.querySelector("#humidity").textContent = data.main.humidity;
  document.querySelector("#wind").textContent = Math.round(
    data.wind.speed * 3.6
  );
};

const updateTemperature = (temp) => {
  const tempElement = document.querySelector("#temp");
  if (document.querySelector(".active-unit").id === "celsius-label-btn") {
    tempElement.textContent = Math.round(temp);
  } else {
    tempElement.textContent = Math.round(temp * 1.8 + 32);
  }
};

const updateForecast = (data) => {
  const forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = "";
  data.list.slice(0, 6).forEach((forecast) => {
    const forecastHTML = `
      <div class="col-2">
        <h6>${formatHours(forecast.dt * 1000)}</h6>
        <img src="http://openweathermap.org/img/wn/${
          forecast.weather[0].icon
        }@2x.png" alt="${forecast.weather[0].description}" height="75" />
        <div>
          <strong><span class="max-temp">${Math.round(
            forecast.main.temp_max
          )}</span></strong><span class="forecast-unit unit">ºC</span> 
          <span class="min-temp">${Math.round(
            forecast.main.temp_min
          )}</span><span class="forecast-unit unit">ºC</span>
        </div>
      </div>`;
    forecastElement.innerHTML += forecastHTML;
  });
};

const getWeatherData = (city) => {
  const apiKey = "5ce165099db98eb1a4172c9b8eea4597";
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    )
    .then((response) => updateWeatherDetails(response.data))
    .catch((error) => console.error("Error fetching weather data:", error));

  axios
    .get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    )
    .then((response) => updateForecast(response.data))
    .catch((error) => console.error("Error fetching forecast data:", error));
};

const getCurrentLocationWeather = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    const apiKey = "YOUR_API_KEY";
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      )
      .then((response) => updateWeatherDetails(response.data))
      .catch((error) =>
        console.error("Error fetching location weather data:", error)
      );

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      )
      .then((response) => updateForecast(response.data))
      .catch((error) =>
        console.error("Error fetching location forecast data:", error)
      );
  });
};

const switchToCelsius = () => {
  document.getElementById("fahrenheit").style.background = "none";
  document.getElementById("celsius").style.background = "#f7e4df";
  const tempElement = document.querySelector("#temp");
  tempElement.textContent = Math.round((tempElement.textContent - 32) / 1.8);
  document
    .querySelectorAll(".unit")
    .forEach((unit) => (unit.textContent = "ºC"));
};

const switchToFahrenheit = () => {
  document.getElementById("celsius").style.background = "none";
  document.getElementById("fahrenheit").style.background = "#f7e4df";
  const tempElement = document.querySelector("#temp");
  tempElement.textContent = Math.round(tempElement.textContent * 1.8 + 32);
  document
    .querySelectorAll(".unit")
    .forEach((unit) => (unit.textContent = "ºF"));
};

document.querySelector("#submit-btn").addEventListener("click", (event) => {
  event.preventDefault();
  const city = document.querySelector("#searched-city").value;
  getWeatherData(city);
});

document.querySelector("#location-btn").addEventListener("click", (event) => {
  event.preventDefault();
  getCurrentLocationWeather();
});

document.querySelector("#celsius").addEventListener("click", switchToCelsius);
document
  .querySelector("#fahrenheit")
  .addEventListener("click", switchToFahrenheit);

getWeatherData("Porto");
