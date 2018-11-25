// See post: http://asmaloney.com/2015/06/code/clustering-markers-on-leaflet-maps

var map = L.map('map', {
    center: [41.883811, -87.631749],
    minZoom: 2,
    zoom: 3
});


var legend = L.control({position: 'topright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend crimes');
    div.innerHTML = '<select><option></option><option>HOMICIDE</option><option>THEFT</option><option>MOTOR VEHICLE THEFT</option><option>CRIMINAL TRESPASS</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
legend.addTo(map);

crimeClicado = 'Crime';

$('select').on('change', function () {
    crimeClicado = this.value;
    initMap(crimeClicado);
});

anoClicado = '2018';

$('#ano1, #ano2, #ano3').click(function () {
    if (this.id == 'ano1') {
        anoClicado = '2018';
    }
    else if (this.id == 'ano2') {
        anoClicado = '2017';
    }
    else if (this.id == 'ano3') {
        anoClicado = '2016';
    }
    initMap(crimeClicado, anoClicado);
});

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a', 'b', 'c']
}).addTo(map);

var myURL = jQuery('script[src$="app.js"]').attr('src').replace('app.js', '');

var myIcon = L.icon({
    iconUrl: myURL + 'images/pin24.png',
    iconRetinaUrl: myURL + 'images/pin48.png',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
});

var markerClusters = L.markerClusterGroup();

initMap(crimeClicado, anoClicado);

function initMap(crimeClicado, anoClicado) {

    markerClusters.clearLayers();

    if (crimeClicado === '' || crimeClicado === 'Crime') {
        url = 'https://data.cityofchicago.org/resource/6zsd-86xi?$where=within_circle(location, 41.883811, -87.631749, 30000)&year=' + anoClicado;
    } else {
        if (anoClicado === undefined)
            anoClicado = "2018";

        url = 'https://data.cityofchicago.org/resource/6zsd-86xi?$where=within_circle(location, 41.883811, -87.631749, 30000)&year=' + anoClicado + '&primary_type=' + crimeClicado;
    }

    $.getJSON(url, function (data) {
        $.each(data, function (i, entry) {

            var houve_prisao = entry.arrest ? 'Sim' : 'Não';

            var popup = '<div id="content">' +
                '<div id="siteNotice">' +
                '</div>' +
                '<h1 id="firstHeading" class="firstHeading">' + entry.location_description + '</h1>' +
                '<div id="bodyContent">' +
                '<p><b>Crime primário:</b> ' + entry.primary_type + '</p>' +
                '<p><b>Descrição do crime:</b> ' + entry.description + '</p>' +
                '<p><b>Bloco:</b> ' + entry.block + '</p>' +
                '<p><b>Data do evento:</b> ' + entry.date + '</p>' +
                '<p><b>Houve prisão:</b> ' + houve_prisao + '</p>' +
                '<p><b>Ano:</b> ' + entry.year + '</p>' +

                '<p>Coordenadas:</p>' +
                '<p><b>Latitude:</b> ' + entry.location.coordinates[1] + '</p>' +
                '<p><b>Longitude:</b> ' + entry.location.coordinates[0] + '</p>' +
                '</div>' +
                '</div>';

            var m = L.marker([entry.location.coordinates[1], entry.location.coordinates[0]], {icon: myIcon})
                .bindPopup(popup);

            markerClusters.addLayer(m);
        });
    });

    map.addLayer(markerClusters);

}
