function getCityInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const cityName = urlParams.get('city');
    const lat = parseFloat(urlParams.get('lat'));
    const lon = parseFloat(urlParams.get('lon'));

    document.getElementById('page-title').textContent = `${cityName} Weather Details`;
    return {cityName, lat, lon};
}

function getCityDataByName(cityName) {
    return cities.find(city => city.name === cityName);
}

function getWindDirectionText(degree) {
    const directions = [
        "N",  // 0° - 22.5°
        "NE", // 22.5° - 67.5°
        "E",  // 67.5° - 112.5°
        "SE", // 112.5° - 157.5°
        "S",  // 157.5° - 202.5°
        "SW", // 202.5° - 247.5°
        "W",  // 247.5° - 292.5°
        "NW", // 292.5° - 337.5°
        "N"   // 337.5° - 360°
    ];

    const index = Math.round(degree / 45) % 8;
    return directions[index];
}


function cityDetail() {
    // get city's lat and lon
    const city = getCityInfo();

    fetchWeather(city.lat, city.lon)
        .then(data => ({
            name: city.cityName,
            weatherCode: data.current.weather_code,
            temperature: data.current.temperature_2m,
            apparentTemperature: data.current.apparent_temperature,
            wind: data.current.wind_speed_10m,
            windDirection: data.current.wind_direction_10m,
            cloudCover: data.current.cloud_cover,
            precipitation: data.current.precipitation
        }))
        .then(result => {
            const city = document.createElement('section');
            city.className = 'bg-white p-6 rounded shadow space-y-2';
            const detailContainer = document.getElementById('page-detail');
            city.innerHTML = `
        <h2 class="text-2xl font-bold">${result.name}</h2>
                <p><strong>Weather:</strong> ${translateWeatherCode(result.weatherCode)}</p>
                <p><strong>Temperature:</strong> ${result.temperature} °C</p>
                <p><strong>Feels Like:</strong> ${result.apparentTemperature} °C</p>
                <p><strong>Wind:</strong> ${result.wind} km/h</p>
                <p><strong>Wind Direction:</strong> ${getWindDirectionText(result.windDirection)}</p>
                <p><strong>Cloud Cover:</strong> ${result.cloudCover} %</p>
                <p><strong>Precipitation:</strong> ${result.precipitation} mm</p>
                <img src="${getWeatherImage(result.weatherCode)}" alt="Weather Icon" class="mx-auto w-20 h-20 mt-4">
        `;
            detailContainer.appendChild(city);
        })
}

window.onload = function () {
    cityDetail();
};




