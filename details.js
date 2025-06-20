function getCityInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const cityName = urlParams.get('city');
    const lat = parseFloat(urlParams.get('lat'));
    const lon = parseFloat(urlParams.get('lon'));

    document.getElementById('page-title').textContent = `${cityName} Weather Details`;
    return { cityName, lat, lon };
}

function getCityDataByName(cityName) {
    return cities.find(city => city.name === cityName);
}

function getWindDirectionText(degree) {
    const directions = [
        "N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"
    ];
    const index = Math.round(degree / 45) % 8;
    return directions[index];
}

async function cityDetail() {
    const city = getCityInfo();

    try {
        const data = await fetchWeather(city.lat, city.lon);

        const detailContainer = document.getElementById('page-detail');
        const citySection = document.createElement('section');
        citySection.className = 'bg-white p-6 rounded shadow space-y-2';
        citySection.innerHTML = `
            <h2 class="text-2xl font-bold">${city.cityName}</h2>
            <p><strong>Weather:</strong> ${translateWeatherCode(data.current.weather_code)}</p>
            <p><strong>Temperature:</strong> ${data.current.temperature_2m} °C</p>
            <p><strong>Feels Like:</strong> ${data.current.apparent_temperature} °C</p>
            <p><strong>Wind:</strong> ${data.current.wind_speed_10m} km/h</p>
            <p><strong>Wind Direction:</strong> ${getWindDirectionText(data.current.wind_direction_10m)}</p>
            <p><strong>Cloud Cover:</strong> ${data.current.cloud_cover} %</p>
            <p><strong>Precipitation:</strong> ${data.current.precipitation} mm</p>
            <img src="${getWeatherImage(data.current.weather_code)}" alt="Weather Icon" class="mx-auto w-20 h-20 mt-4">
        `;
        detailContainer.appendChild(citySection);
    } catch (error) {
        console.error("Error loading city details:", error);
        const detailContainer = document.getElementById('page-detail');
        detailContainer.innerHTML = "<p class='text-red-500'>Failed to load city weather details.</p>";
    }
}

window.onload = function () {
    cityDetail();
};
