
/* WEATHER NOW - JAVASCRIPT */

// 1. API Configuration

const API_KEY = "fec3826145d87ae9eeffea6c33949891";

const API_URL = "https://api.openweathermap.org/data/2.5/weather";


// 2. HTML Elements

const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");

const loadingMessage = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");

const welcomeCard = document.getElementById("welcome-card");
const weatherResult = document.getElementById("weather-result");

const cityName = document.getElementById("city-name");
const countryName = document.getElementById("country-name");

const weatherIcon = document.getElementById("weather-icon");
const weatherDescription = document.getElementById("weather-description");

const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feels-like");
const highLow = document.getElementById("high-low");

const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const pressure = document.getElementById("pressure");

const updatedAt = document.getElementById("updated-at");


// 3. Weather Icons

const weatherIcons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Smoke: "🌫️",
    Haze: "🌫️",
    Dust: "🌪️",
    Fog: "🌫️",
    Sand: "🌪️",
    Ash: "🌋",
    Squall: "💨",
    Tornado: "🌪️"
};


// 4. Show Loading State

function showLoading() {
    loadingMessage.hidden = false;
    errorMessage.hidden = true;
    weatherResult.hidden = true;
    welcomeCard.hidden = true;

    loadingMessage.textContent = "Loading weather data...";

    searchButton.disabled = true;
    searchButton.textContent = "Loading...";
}


// 5. Hide Loading State

function hideLoading() {
    loadingMessage.hidden = true;

    searchButton.disabled = false;
    searchButton.textContent = "Search";
}


// 6. Show Error Message

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;

    weatherResult.hidden = true;
    welcomeCard.hidden = true;
}


// 7. Fetch Weather Data from API

async function getWeather(city) {

    // Check whether API key has been added
    if (
        !API_KEY ||
        API_KEY === "YOUR_API_KEY_HERE"
    ) {
        showError(
            "Please add your OpenWeatherMap API key inside script.js."
        );
        return;
    }

    showLoading();

    try {

        // Build API request URL
        const url = new URL(API_URL);

        url.search = new URLSearchParams({
            q: city,
            appid: API_KEY,
            units: "metric"
        }).toString();


        // Fetch data asynchronously
        const response = await fetch(url);


        // Check API response
        if (!response.ok) {

            if (response.status === 404) {
                throw new Error(
                    "City not found. Please check the spelling and try again."
                );
            }

            if (response.status === 401) {
                throw new Error(
                    "API key is invalid or not active yet. Check your key and try again later."
                );
            }

            if (response.status === 429) {
                throw new Error(
                    "Too many requests. Please wait a little and try again."
                );
            }

            throw new Error(
                "Unable to fetch weather data. Please try again."
            );
        }


        // Convert JSON response into JavaScript data
        const data = await response.json();


        // Display received weather data
        displayWeather(data);

    } catch (error) {

        // Handle network and API errors
        showError(
            error.message ||
            "Something went wrong. Please check your internet connection."
        );

    } finally {

        // Always stop loading indicator
        hideLoading();
    }
}


// 8. Display Weather Data

function displayWeather(data) {

    // City information
    cityName.textContent = data.name;

    countryName.textContent =
        data.sys.country || "Country unavailable";


    // Weather condition
    const condition = data.weather[0].main;

    weatherDescription.textContent =
        data.weather[0].description;


    // Select the appropriate weather icon
    weatherIcon.textContent =
        weatherIcons[condition] || "🌤️";


    // Temperature values
    temperature.textContent =
        `${Math.round(data.main.temp)}°C`;

    feelsLike.textContent =
        `${Math.round(data.main.feels_like)}°C`;

    highLow.textContent =
        `${Math.round(data.main.temp_max)}° / ${Math.round(data.main.temp_min)}°C`;


    // Additional weather information
    humidity.textContent =
        `${data.main.humidity}%`;

    windSpeed.textContent =
        `${data.wind.speed} m/s`;

    pressure.textContent =
        `${data.main.pressure} hPa`;


    // Update timestamp
    const currentTime = new Date();

    updatedAt.textContent =
        `Last checked: ${currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })}`;


    // Show results
    errorMessage.hidden = true;
    welcomeCard.hidden = true;
    weatherResult.hidden = false;
}


// 9. Handle Search Form Submission

searchForm.addEventListener("submit", function (event) {

    // Prevent page refresh
    event.preventDefault();

    // Get and clean city name
    const city = cityInput.value.trim();

    // Validate input
    if (!city) {
        showError("Please enter a city name.");
        cityInput.focus();
        return;
    }

    // Request weather information
    getWeather(city);
});


// 10. Initial Console Message

console.log("WeatherNow application is ready!");
