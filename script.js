const cities = [
    { name: 'Amsterdam', lat: 52.374, lon: 4.8897 },
    { name: 'Berlin', lat: 52.5244, lon: 13.4105 },
    { name: 'Paris', lat: 48.8534, lon: 2.3488 },
    { name: 'Tokyo', lat: 35.6895, lon: 139.6917 },
    { name: 'Canada', lat: 60.1087, lon: -113.6426 },
    { name: 'Thailand', lat: 15.5, lon: 101 }
];

function translateWeatherCode(code) {
    if (code === 0) return "Sunny";
    if (code === 1) return "Mostly Sunny";
    if (code === 2) return "Partly Cloudy";
    if (code === 3) return "Cloudy";
    if (code === 45 || code === 48) return "Foggy";
    if ([51, 53, 55, 61, 63, 65].includes(code)) return "Rainy";
    if ([71, 73, 75].includes(code)) return "Snowy";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";
    return "Unknown";
}

function getWeatherImage(code) {
    if (code === 0) return "images/sunny.png";
    if ([1, 2, 3].includes(code)) return "images/cloudy.png";
    // if ([45, 48].includes(code)) return "images/foggy.png";
    if ([61, 63, 65].includes(code)) return "images/rainy.png";
    if ([71, 73, 75].includes(code)) return "images/snowy.png";
    if ([95, 96, 99].includes(code)) return "images/thunderstorm.png";
    return "images/unknown.png";
}


function loadCities() {
    const list = document.getElementById('city-list')

    Promise.all(
        cities.map(city =>
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&hourly=weather_code&current=temperature_2m,wind_speed_10m&timezone=auto`)
                .then(res => res.json())
                .then(data => ({
                    name: city.name,
                    weatherCode: data.hourly.weather_code[0],
                    temperature: data.current.temperature_2m,
                    wind: data.current.wind_speed_10m
                }))
        )
    )
        .then(results => {
            results.forEach(city => {
                const card = document.createElement('div');
                card.className = "bg-white p-4 rounded shadow text-center cursor-pointer hover:bg-blue-100";
                card.innerHTML = `
                <h2 class="text-xl font-bold">${city.name}</h2>
                <img src="${getWeatherImage(city.weatherCode)}" alt="Weather Icon" class="mx-auto w-16 h-16">
                <p class="text-lg">Weather: ${translateWeatherCode(city.weatherCode)}</p>
                <p class="text-lg">Temperature: ${city.temperature}°C</p>
                <p class="text-lg">Wind Speed: ${city.wind}km/h</p>
            `;

                list.appendChild(card);
            });
        })
        .catch(error => {
            list.innerHTML = "<p class='text-red-500'>Load Error, Please refresh</p>";
            console.error(error);
        });
}

window.onload = loadCities;
