const cities = [
    { name: "Amsterdam", lat: 52.374, lon: 4.8897 },
    { name: "Rotterdam", lat: 51.9225, lon: 4.4792 },
    { name: "Middelburg", lat: 51.5, lon: 3.6139 }
];

function loadCities() {
    const list = document.getElementById('city-list')

    Promise.all(
        cities.map(city => 
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&daily=sunshine_duration&hourly=temperature_2m,cloud_cover&timezone=GMT`)
                .then(res => res.json())
                .then(data => ({ name: city.name, temperature: data.hourly.temperature_2m[0], sunshine: data.daily.sunshine_duration[0], cloud: data.hourly.cloud_cover[0]}))
        )
    )
    .then(results => {
        results.forEach(city => {
            const card = document.createElement('div');
            card.className = "bg-white p-4 rounded shadow text-center cursor-pointer hover:bg-blue-100";
            card.innerHTML = `
                <h2 class="text-xl font-bold">${city.name}</h2>
                <p class="text-lg">Temperature: ${city.temperature}°C</p>
                <p class="text-lg">Cloud Cover: ${city.cloud}%</p>
                <p class="text-lg">Sunshine Duration: ${(city.sunshine / 3600).toFixed(1)} Hours</p>
            `;

            list.appendChild(card);
        });
    })
    .catch(error => {
        list.innerHTML = "<p class='text-red-500'>load error</p>";
        console.error(error);
    });
}

window.onload = loadCities;
