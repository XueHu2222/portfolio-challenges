const cities = [
    { name: 'Amsterdam', lat: 52.374, lon: 4.8897 },
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
    if ([61, 63, 65].includes(code)) return "images/rainy.png";
    if ([71, 73, 75].includes(code)) return "images/snowy.png";
    if ([95, 96, 99].includes(code)) return "images/thunderstorm.png";
    return "images/unknown.png";
}

async function fetchWeather(lat, lon) {
    const Url = "https://api.open-meteo.com/v1/forecast";
    const params = [
        "latitude=" + lat,
        "longitude=" + lon,
        "current=temperature_2m,wind_speed_10m,weather_code,apparent_temperature,wind_direction_10m,precipitation,cloud_cover",
        "timezone=auto"
    ].join("&");

    try {
        const res = await fetch(`${Url}?${params}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("fetchWeather error:", error);
        throw error;
    }
}
