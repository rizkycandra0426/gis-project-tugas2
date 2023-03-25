//Add Map
var map = L.map('map').setView([-8.4095188, 115.188919], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; Dex',
  maxZoom: 18,
}).addTo(map);

var myIcon = L.icon({
  iconUrl: 'google-maps.png',
  iconSize: [45, 45],
  iconAnchor: [20, 40],
});

L.marker([51.5, -0.09], { icon: myIcon }).addTo(map);

// Code for modal window goes here

map.on('click', function (e) {
  var modal = document.getElementById('myModal');
  var latitudeField = document.getElementById('latitude');
  var longitudeField = document.getElementById('longitude');
  latitudeField.value = e.latlng.lat.toFixed(6);
  longitudeField.value = e.latlng.lng.toFixed(6);
  modal.style.display = 'block';
});

var modal = document.getElementById('myModal');
var closeButton = document.getElementsByClassName('close')[0];
var form = document.getElementsByTagName('form')[0];

closeButton.onclick = function () {
  modal.style.display = 'none';
};

form.onsubmit = function (event) {
  event.preventDefault();
  var latitude = parseFloat(document.getElementById('latitude').value);
  var longitude = parseFloat(document.getElementById('longitude').value);
  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  var address = document.getElementById('address').value;
  var phone = document.getElementById('phone').value;
  var data = {
    latitude: latitude,
    longitude: longitude,
    name: name,
    email: email,
    address: address,
    phone: phone,
  };

  var savedData = JSON.parse(localStorage.getItem('markerData')) || [];
  savedData.push(data);
  localStorage.setItem('markerData', JSON.stringify(savedData));
  alert('Marker and data saved!');
  modal.style.display = 'none';
  savedData.forEach(function (data) {
    L.marker([data.latitude, data.longitude], { icon: myIcon }).addTo(map);
  });
};

var savedData = JSON.parse(localStorage.getItem('markerData')) || [];
savedData.forEach(function (data) {
  L.marker([data.latitude, data.longitude], { icon: myIcon }).addTo(map);
});

// When adding markers to the map
savedData.forEach(function (data) {
  var marker = L.marker([data.latitude, data.longitude], { icon: myIcon }).addTo(map);

  // Add click event listener to the marker
  marker.on('click', function (e) {
    // Show dialog box with marker's details
    var details = 'Name: ' + data.name + '<br>' + 'Email: ' + data.email + '<br>' + 'Address: ' + data.address + '<br>' + 'Phone: ' + data.phone + '<br>' + 'Lat: ' + data.latitude + '<br>' + 'Lat: ' + data.longitude;
    details += "<div class='delete-button'><button class='delete-marker' data-latitude='" + data.latitude + "' data-longitude='" + data.longitude + "'>Delete</button></div>";
    L.popup().setLatLng([data.latitude, data.longitude]).setContent(details).openOn(map);
  });
});

// Add event listener to map's container
var mapContainer = document.getElementById('map');
mapContainer.addEventListener('click', function (e) {
  // Check if clicked element has the 'delete-marker' class
  if (e.target.classList.contains('delete-marker')) {
    // Get latitude and longitude of marker to delete
    var latitude = parseFloat(e.target.getAttribute('data-latitude'));
    var longitude = parseFloat(e.target.getAttribute('data-longitude'));

    // Remove marker from map
    map.eachLayer(function (layer) {
      if (layer instanceof L.Marker && layer.getLatLng().lat === latitude && layer.getLatLng().lng === longitude) {
        map.removeLayer(layer);
      }
    });

    // Remove marker data from web storage
    var savedData = JSON.parse(localStorage.getItem('markerData')) || [];
    savedData = savedData.filter(function (data) {
      return data.latitude !== latitude || data.longitude !== longitude;
    });
    localStorage.setItem('markerData', JSON.stringify(savedData));
    alert('Marker Deleted!');
    map.closePopup();
  }
});

// // Add saved markers to map
// for (var i = 0; i < savedData.length; i++) {
//   var marker = L.marker([savedData[i].latitude, savedData[i].longitude]).addTo(map);
//   marker.bindPopup(
//     '<b>Marker ' +
//       (i + 1) +
//       '</b><br>Latitude: ' +
//       savedData[i].latitude +
//       '<br>Longitude: ' +
//       savedData[i].longitude +
//       "<br><button class='delete-marker' data-latitude='" +
//       savedData[i].latitude +
//       "' data-longitude='" +
//       savedData[i].longitude +
//       "'>Delete Marker</button>"
//   );
// }