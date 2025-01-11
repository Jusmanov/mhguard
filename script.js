var map = L.map('map').setView([40.7128, -74.0060], 12);

const CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

var markers = [];
var cityCounts = {
    brooklyn: 0,
    manhattan: 0,
    queens: 0,
    bronx: 0,
    staten_island: 0
};

fetch('https://data.cityofnewyork.us/resource/8nqg-ia7v.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        data.forEach(point => {
            if (!point.latitude || !point.longitude) {
                return;
            }

            var lat = parseFloat(point.latitude);
            var lon = parseFloat(point.longitude);
            var name1 = point.name_1 || 'N/A';
            var name2 = point.name_2 || 'N/A';
            var street = point.street_1 || 'N/A';
            var phone = point.phone || 'N/A';
            var website = point.website || 'N/A';
            var city = (point.city || '').toLowerCase().replace(' ', '_');

            if (city === 'new_york') {
                city = 'manhattan';
            }

            if (city in cityCounts) {
                cityCounts[city]++;
            }

            var marker = L.circleMarker([lat, lon], {
                color: '#30D5C8',
                radius: 5
            }).addTo(map).bindPopup(
                `<b>${name1}</b> (${name2})<br>Street: ${street}<br>Phone: ${phone}<br>Website: <a href="${website}" target="_blank">${website}</a>`
            );

            markers.push({ marker, name1 });
        });

        document.getElementById('brooklyn-count').innerText = cityCounts.brooklyn;
        document.getElementById('manhattan-count').innerText = cityCounts.manhattan;
        document.getElementById('queens-count').innerText = cityCounts.queens;
        document.getElementById('bronx-count').innerText = cityCounts.bronx;
        document.getElementById('staten-count').innerText = cityCounts.staten_island;
    })
    .catch(error => console.error('Error w/ data:', error));

document.getElementById('search-input').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    markers.forEach(({ marker, name1 }) => {
        if (name1.toLowerCase().includes(searchTerm)) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
});
