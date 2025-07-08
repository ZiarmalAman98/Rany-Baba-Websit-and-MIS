<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rikshaw Live Location</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        #map {
            height: 500px;
            width: 100%;
        }
    </style>
</head>
<body>
    <h1>Rikshaw Current Location</h1>
    <div id="map"></div>

    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
        var map = L.map('map').setView([34.4328861, 70.461774], 12);  // Default position

        // Tile Layer (OSM)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Watch Position (For live location)
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(function(position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;

                // Update marker position
                var marker = L.marker([latitude, longitude]).addTo(map);
                map.setView([latitude, longitude], 12);  // Center the map on the new location
            });
        }
    </script>
</body>
</html>
