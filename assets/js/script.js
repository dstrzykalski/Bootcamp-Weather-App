//These are all the basic functions that will be called upon again
const apiKey = 'df6d4a31396095f53954a5c5b9301ee9';
const findLocation = document.querySelector('.location');
const findWeather = document.querySelector('.weather');
const findTemperature = document.querySelector('.temperature');
const findHumidity = document.querySelector('.humidity');
const findContainer = document.querySelector('.container');
const searchButton = document.querySelector('#submit');
const searchBar = document.querySelector('.searchBar');
const cities = JSON.parse(localStorage.getItem('cities')) || [];
const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=';
const enterCity = document.querySelector(".enterCity");

//This handles the actual retrieval of the weather data
searchBar.addEventListener("submit", async event => {
    event.preventDefault();

    const city = enterCity.value;

    if(city){
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        }
        catch(error){
            console.error(error);
            displayError(error);
        }
    }
    else{
        displayError("Error");
    }
});


//the async function that retrieves the data from the api and then returns to the submit function
async function getWeatherData(city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    const response = await fetch(apiUrl);

    if(!response.ok){
        throw new Error("error");
    }

    return await response.json();
}


//handles the display of that data
function displayWeatherInfo(data){
    // Clear previous forecast data
    findHumidity.innerHTML = '';
    findWeather.innerHTML = '';
    findLocation.innerHTML = '';
    findTemperature.innerHTML = '';

    const place = data.city.name;
    // forloop to display the data
    for (let i = 0; i < data.list.length; i += 8) {
        // Get the forecast data for a specific day
        const forecastData = data.list[i];

        // Assign variables to the data
        const { dt_txt: date, main: { temp, humidity }, weather: [{ description }] } = forecastData;


        // Create the elements to display the info
        const forecastContainer = document.createElement("div");
        const dateDisplay = document.createElement("h2");
        const humidityDisplay = document.createElement("p");
        const descDisplay = document.createElement("p");
        const tempDisplay = document.createElement("p");
        const locationDisplay = document.createElement("h1");

        // Assign the data to the elements
        dateDisplay.textContent = formatDate(date);
        humidityDisplay.textContent = `Humidity: ${humidity}%`;
        descDisplay.textContent = description;
        tempDisplay.textContent = `${((temp - 273.15) * (9/5) + 32).toFixed(1)}°F`;
        //this line makes it so the city name only displays once
        if (i === 0) {
            locationDisplay.textContent = place;
        }
        // Append the elements to the container
        forecastContainer.appendChild(dateDisplay);
        forecastContainer.appendChild(humidityDisplay);
        forecastContainer.appendChild(descDisplay);
        forecastContainer.appendChild(tempDisplay);
        findLocation.appendChild(locationDisplay);

        // Append the container to the forecast section
        findContainer.appendChild(forecastContainer);
    }
}

// Format the date to display only the date part
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Save the weather data in local storage
localStorage.setItem('cities', JSON.stringify(cities));
