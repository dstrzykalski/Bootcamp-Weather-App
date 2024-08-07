
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
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
const enterCity = document.querySelector(".enterCity");
const card = document.querySelector(".card");

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

async function getWeatherData(city){

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const response = await fetch(apiUrl);

    if(!response.ok){
        throw new Error("error");
    }

    return await response.json();
}



//handles the display of that data
function displayWeatherInfo(data){

    const {name: city, 
           main: {temp, humidity}, 
           weather: [{description, id}]} = data;

    card.textContent = "";
    card.style.display = "flex";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${((temp - 273.15) * (9/5) + 32).toFixed(1)}°F`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;



    findLocation.appendChild(cityDisplay);
    findTemperature.appendChild(tempDisplay);
    findHumidity.appendChild(humidityDisplay);
    findWeather.appendChild(descDisplay);
}