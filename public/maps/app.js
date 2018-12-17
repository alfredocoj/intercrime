// See post: http://asmaloney.com/2015/06/code/clustering-markers-on-leaflet-maps


var map = L.map('map', {
  center: [10.0, 5.0],
  minZoom: 2,
  zoom: 2
});


var legend = L.control({position: 'topright'});
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend form-group crimes');
  div.innerHTML = '<label for="select1">Crimes</label>\n' +
    '<select class="form-control" id="select1"><option></option><option>HOMICIDE</option><option>THEFT</option><option>MOTOR VEHICLE THEFT</option><option>CRIMINAL TRESPASS</option></select>';
  div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
  return div;
};
legend.addTo(map);


var legend = L.control({position: 'topleft'});
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend form-group');
  div.innerHTML = '<label for="date-input1" class="col-form-label">Data inicial</label>\n' +
    '  <div>\n' +
    '    <input class="form-control" type="date" id="date-input1">\n' +
    '  </div>';
  div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
  return div;
};
legend.addTo(map);

var legend = L.control({position: 'topleft'});
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend form-group');
  div.innerHTML = '<label for="date-input2" class="col-form-label">Data final</label>\n' +
    '  <div>\n' +
    '    <input class="form-control" type="date" id="date-input2">\n' +
    '  </div>';
  div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
  return div;
};
legend.addTo(map);

crimeClicado = 'Crime';

$('select').on('change', function () {
  crimeClicado = this.value;
  initMap(crimeClicado);
});

// anoClicado = undefined;
//
// $('#ano1, #ano2, #ano3').click(function () {
//   if (this.id == 'ano1') {
//     anoClicado = '2018';
//   }
//   else if (this.id == 'ano2') {
//     anoClicado = '2017';
//   }
//   else if (this.id == 'ano3') {
//     anoClicado = '2016';
//   }
//   initMap(crimeClicado, anoClicado);
// });

dateInicial = undefined;
dateFinal = undefined;

// $('#date-input1').change(function () {
//   if ($('#date-input1').val() !== '') {
//     dateInicial = $('#date-input1').val() + 'T00:01:00.000Z';
//
//     if($('#date-input2').val() === '')
//       initMap(crimeClicado, dateInicial, dateInicial);
//     else
//       initMap(crimeClicado, dateInicial, dateFinal);
//   }
// });

$('#date-input2').change(function () {
  if ($('#date-input2').val() !== '' && $('#date-input1').val() !== '') {
    dateFinal = $('#date-input2').val() + 'T00:01:00.000Z';

    if($('#date-input1').val() === '')
      initMap(crimeClicado, dateFinal, dateFinal);
    else
      initMap(crimeClicado, dateInicial, dateFinal);
  }
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

initMap(crimeClicado, dateFinal, dateFinal);

function initMap(crimeClicado, dateInicial, dateFinal) {

  markerClusters.clearLayers();

  url = 'http://cidadesinteligentes.lsdi.ufma.br/collector/resources/data/';

  filtros = {"capabilities": ["incidencia_crime"], "matchers": {}};


  if (!(crimeClicado == '') && !(crimeClicado == 'Crime'))
    filtros["matchers"]["crime_type.eq"] = crimeClicado;


  // if (anoClicado === undefined)
  //   filtros["matchers"]["year.in"] = [2016, 2017, 2018];
  // else
  //   filtros["matchers"]["year.eq"] = anoClicado;

  // if (dateInicial === '' && dateFinal === '')
  //   filtros["matchers"]["year.in"] = [2016, 2017, 2018];

  if (dateInicial !== undefined || dateInicial !== '') {
    filtros["start_date"] = dateInicial;
  } else {
    filtros["start_date"] = "2016-01-01T00:01:00.000Z";
  }

  if (dateFinal !== undefined || dateFinal !== '') {
    filtros["end_date"] = dateFinal;
  } else {
    filtros["end_date"] = "2018-12-12T00:01:00.000Z";
  }

  $.post(url, filtros, function (data, textStatus) {

    $.each(data.resources, function (i, recurso) {
      $.each(recurso.capabilities.incidencia_crime, function (j, crime) {

        var houve_prisao = crime.arrest ? 'Sim' : 'Não';

        var popup = '<div id="content">' +
          '<div id="siteNotice">' +
          '</div>' +
          '<h1 id="firstHeading" class="firstHeading">' + crime.location_description + '</h1>' +
          '<div id="bodyContent">' +
          '<p><b>Crime primário:</b> ' + crime.crime_type + '</p>' +
          '<p><b>Descrição do crime:</b> ' + crime.description + '</p>' +
          '<p><b>Bloco:</b> ' + crime.block + '</p>' +
          '<p><b>Data do evento:</b> ' + crime.date + '</p>' +
          '<p><b>Houve prisão:</b> ' + houve_prisao + '</p>' +
          '<p><b>Ano:</b> ' + crime.year + '</p>' +

          '<p>Coordenadas:</p>' +
          '<p><b>Latitude:</b> ' + crime.lat + '</p>' +
          '<p><b>Longitude:</b> ' + crime.lon + '</p>' +
          '</div>' +
          '</div>';

        if (crime.lat && crime.lon) {

          var m = L.marker([crime.lat, crime.lon], {icon: myIcon})
            .bindPopup(popup);

          markerClusters.addLayer(m);
        }

      });

    });
  }, "json");

  map.addLayer(markerClusters);

}
