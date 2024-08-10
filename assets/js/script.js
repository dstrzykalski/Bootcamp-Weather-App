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
const findWind = document.querySelector('.wind');

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
    findWind.innerHTML = '';
    findContainer.innerHTML = '';
    console.log (data);
    const place = data.city.name;
    // for loop to display the data
    for (let i = 0; i < data.list.length; i += 8) {
        // Get the forecast data for a specific day
        const forecastData = data.list[i];

        // Assign variables to the data
        const { dt_txt: date, main: { temp, humidity }, weather: [{ description }] } = forecastData;
        const { wind: { speed } } = forecastData;
        const { icon } = forecastData.weather[0];

        // Create the elements to display the info
        const forecastContainer = document.createElement("div");
        const dateDisplay = document.createElement("h2");
        const humidityDisplay = document.createElement("p");
        const descDisplay = document.createElement("p");
        const tempDisplay = document.createElement("p");
        const locationDisplay = document.createElement("h1");
        const windDisplay = document.createElement("p");
        const iconDisplay = document.createElement("img");

        // Assign the data to the elements
        dateDisplay.textContent = formatDate(date);
        humidityDisplay.textContent = `Humidity: ${humidity}%`;
        descDisplay.textContent = description;
        tempDisplay.textContent = `${((temp - 273.15) * (9/5) + 32).toFixed(1)}°F`;
        windDisplay.textContent = `Wind Speed: ${speed} mph`;
        iconDisplay.src = `https://openweathermap.org/img/wn/${icon}.png`;
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
        forecastContainer.appendChild(windDisplay);
        forecastContainer.appendChild(iconDisplay);

        // Append the container to the forecast section
        findContainer.appendChild(forecastContainer);

    }
    saveToLocalStorage(place);

}

// Format the date to display only the date part
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
function saveToLocalStorage (cityName) {
    // Check if the city is already in the list
    if (!cities.includes(cityName)) {
        // Add the city to the list
        cities.push(cityName);
        // Save the weather data in local storage
        localStorage.setItem('cities', JSON.stringify(cities));
    }
}

function displaySearchHistory(){
    console.log (cities);
    let cityDiv = document.createElement("div");
    for (let i=0; i<cities.length; i++){
        let cityParagraph = document.createElement("p");
        let cityButton = document.createElement("button");
        cityButton.addEventListener("click", async function(event){
            event.preventDefault();
            console.log (event.target.innerHTML);
            let cityName = event.target.innerHTML;
            let data = await getWeatherData(cityName);
            console.log(data);
            // Promise needs to be resolved
            // 1 - .then()
            // 2 - async await
            
            displayWeatherInfo(data);
        })
        cityButton.textContent = cities[i];
        cityParagraph.append(cityButton);
        cityDiv.append(cityParagraph);
    }
document.getElementById("search-history").append(cityDiv);
}

displaySearchHistory();