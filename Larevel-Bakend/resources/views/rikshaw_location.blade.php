<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rikshaw Live Location</title>
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
        #location {
            margin-top: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <h1>Rikshaw Current Location</h1>
    <div id="map"></div>
    <div id="location">
        <p>Latitude: <span id="latitude">Loading...</span></p>
        <p>Longitude: <span id="longitude">Loading...</span></p>
    </div>

    <script>
        // د Google Maps نقشه بارول
        let map;
        let marker;

        function initMap() {
            // د نقشه ابتدايي موقعیت
            map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: 0, lng: 0 },
                zoom: 12,
            });

            // د لوکیشن ترلاسه کولو لپاره د Geolocation API کارول
            if (navigator.geolocation) {
                navigator.geolocation.watchPosition(function(position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    // د لوکیشن معلومات ښکاره کول
                    document.getElementById("latitude").innerText = latitude;
                    document.getElementById("longitude").innerText = longitude;

                    // د لوکیشن سره نښه (Marker) حرکتول
                    const location = { lat: latitude, lng: longitude };

                    // که نښه موجوده وي نو هغه اپډیټ کړئ
                    if (marker) {
                        marker.setPosition(location);
                    } else {
                        marker = new google.maps.Marker({
                            position: location,
                            map: map,
                            title: "Rikshaw Location",
                        });
                    }

                    // نقشه د موجوده موقعیت سره تنظیمول
                    map.setCenter(location);
                }, function(error) {
                    console.log("Error in getting location: ", error);
                });
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        }
    </script>

    <!-- Google Maps API بارول -->
    <script async
            src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initMap">
    </script>
</body>
</html>
