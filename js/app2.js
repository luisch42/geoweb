// Reemplaza 'TU_TOKEN_DE_ACCESO_MAPBOX' con tu propio token de acceso de Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoibHVpc2NoNDIiLCJhIjoiY2w1dDN2aDN1Mm5wYTNpdGVmcmwwcm8wbSJ9.968iFcF38p2HGnOV1WI8aQ';

const coloresProvincias = {
  'Bocas del Toro': '#FFA07A',
  'Chiriquí': '#7FFFD4',
  'Coclé': '#FFE4C4',
  'Colón': '#FFD700',
  'Darién': '#90EE90',
  'Herrera': '#ADFF2F',
  'Los Santos': '#FFC0CB',
  'Panamá': '#B0C4DE',
  'Veraguas': '#FFB6C1',
  'Kuna Yala': '#2a1e35',
  'Emberá': '#4a1e8a',
  'Ngöbe Buglé': '#5a1e8a',
  'Panamá Oeste': '#7a1e8a',
};

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v10',
  center: [-80.7821, 8.5380], // Coordenadas iniciales
  zoom: 7 // Nivel de zoom inicial
});

let provinciasVisible = true; // Estado de visibilidad de la capa de provincias

const provinciasLayers = ['provincias-fill', 'provincias-outline'];

map.addControl(new mapboxgl.AttributionControl({
    compact: true
}));
map.addControl(new mapboxgl.NavigationControl());

//control de geocodificación limitado a Panamá
map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    countries: 'pa', // Limita la búsqueda a Panamá
    placeholder: 'Buscar en Panamá',
    marker: true, // No colocar un marcador en el lugar encontrado
    collapsed:true
  })
);

map.on('load', function () {
  fetch('datos/provincias_panama.geojson')
    .then(response => response.json())
    .then(data => {

      // Agrega la fuente de datos GeoJSON al mapa
      map.addSource('provincias', {
        type: 'geojson',
        data: data
      });

      // Agrega la capa de polígonos de provincias al mapa
      map.addLayer({
        id: 'provincias-fill',
        type: 'fill',
        source: 'provincias',
        layout: {},
        paint: {
          'fill-color': ['get', ['get', 'admin1Name'], ['literal', coloresProvincias]],
          'fill-opacity': 0.7
        }
      });

      // Agrega la capa de líneas de borde de provincias al mapa
      map.addLayer({
        id: 'provincias-outline',
        type: 'line',
        source: 'provincias',
        layout: {},
      });
