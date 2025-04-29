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
        // window.open(`details.html?city=${encodeURIComponent(cityName)}`);
    });
    
    return card;
}

function loadCities() {
    const list = document.getElementById('city-list')

    // create array and fetch each city data
    Promise.all(
        cities.map(city =>
            fetchWeather(city.lat, city.lon)
                .then(data => ({
                    name: city.name,
                    lat: city.lat,
                    lon: city.lon,
                    weatherCode: data.current.weather_code,
                    temperature: data.current.temperature_2m,
                    wind: data.current.wind_speed_10m
                }))
        )
    )
        .then(results => {
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
        })
        .catch(error => {
            list.innerHTML = "<p class='text-red-500'>Load Error, Please refresh</p>";
            console.error(error);
        });
}

function loadUserLocationWeather() {
    const list = document.getElementById('city-list');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                

                // get city name
                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
                    .then(res => res.json())
                    .then(locationData => {
                        const cityName = locationData.address.city || "Unknown Location";

                        // get city data
                        fetchWeather(lat, lon)
                            .then(data => {
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
                            });
                    });
            },
            error => {
                console.error("Error getting location:", error);
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

window.onload = function() {
    loadUserLocationWeather();
    loadCities();
};
