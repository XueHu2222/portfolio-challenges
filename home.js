function createWeatherCard(cityName, lat, lon, weatherCode, temperature, windSpeed, extraText) {
    const card = document.createElement('div');
    card.className = "bg-white p-4 rounded shadow text-center cursor-pointer hover:bg-blue-100";

    card.innerHTML = `
        <h2 class="text-xl font-bold">${cityName} ${extraText}</h2>
        <img src="${getWeatherImage(weatherCode)}" alt="Weather Icon" class="mx-auto w-16 h-16">
        <p class="text-lg">Weather: ${translateWeatherCode(weatherCode)}</p>
        <p class="text-lg">Temperature: ${temperature}°C</p>
        <p class="text-lg">Wind Speed: ${windSpeed} km/h</p>
    `;

    card.addEventListener('click', () => {
        window.location.href = `details.html?city=${cityName}&lat=${lat}&lon=${lon}`;
    });

    return card;
}

async function loadCities() {
    const list = document.getElementById('city-list');
    try {
        const results = await Promise.all(
            cities.map(async city => {
                const data = await fetchWeather(city.lat, city.lon);
                return {
                    name: city.name,
                    lat: city.lat,
                    lon: city.lon,
                    weatherCode: data.current.weather_code,
                    temperature: data.current.temperature_2m,
                    wind: data.current.wind_speed_10m
                };
            })
        );

        results.forEach(city => {
            const card = createWeatherCard(
                city.name,
                city.lat,
                city.lon,
                city.weatherCode,
                city.temperature,
                city.wind,
                ''
            );
            list.appendChild(card);
        });
    } catch (error) {
        list.innerHTML = "<p class='text-red-500'>Load Error, Please refresh</p>";
        console.error(error);
    }
}

async function loadUserLocationWeather() {
    const list = document.getElementById('city-list');

    if (!navigator.geolocation) {
        console.error("Geolocation is not supported by this browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const locationData = await res.json();
            const cityName = locationData.address.city || "Unknown Location";

            const data = await fetchWeather(lat, lon);
            const card = createWeatherCard(
                cityName,
                lat,
                lon,
                data.current.weather_code,
                data.current.temperature_2m,
                data.current.wind_speed_10m,
                '(Your Location)'
            );
            list.prepend(card);
        } catch (error) {
            console.error("Error fetching location weather:", error);
        }
    }, error => {
        console.error("Error getting location:", error);
    });
}

window.onload = function () {
    loadUserLocationWeather();
    loadCities();
};
