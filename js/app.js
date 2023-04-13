mapboxgl.accessToken = 'pk.eyJ1IjoibHVpc2NoNDIiLCJhIjoiY2w1dDN2aDN1Mm5wYTNpdGVmcmwwcm8wbSJ9.968iFcF38p2HGnOV1WI8aQ';

const coloresProvincias = {
  'Bocas del Toro': '#2ECC71',
  'Chiriquí': '#FFC300',
  'Coclé': '#2980B9',
  'Colón': '#8E44AD',
  'Darién': '#9B59B6',
  'Herrera': '#3498DB',
  'Los Santos': '#27AE60',
  'Panamá': '#FF5733',
  'Veraguas': '#F1C40F',
  'Kuna Yala': '#FFC300',
  'Emberá': '#27AE60',
  'Ngöbe Buglé': '#E74C3C',
  'Panamá Oeste': '#E74C3C',
};

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v10',
  center: [-80.7821, 8.5380], // Coordenadas iniciales
  zoom: 7 // Nivel de zoom inicial
});


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
        paint: {
          'line-color': 'blue',
          'line-width': 1
        }
      });



      // Agrega interacción al pasar el cursor sobre las provincias
      map.on('mousemove', 'provincias-fill', function (e) {
        map.getCanvas().style.cursor = 'pointer';
      });

      // Muestra información de la provincia al hacer clic
      map.on('click', 'provincias-fill', function (e) {
        const provincia = e.features[0].properties;
        const poblacionTotal = provincia.pan_admpop_adm1_2022_T_TL;
        

        const edades = [
            '00_04', '05_09', '10_14', '15_19', '20_24', '25_29', '30_34',
            '35_39', '40_44', '45_49', '50_54', '55_59', '60_64', '65_69',
            '70_74', '75_79', '80Plus'
          ];

          let tableRows = '';
        for (const edad of edades) {
          const keyF = `pan_admpop_adm1_2022_F_${edad}`;
          const keyM = `pan_admpop_adm1_2022_M_${edad}`;
          tableRows += `
            <tr>
              <td>${edad.replace('_', '-')}</td>
              <td>${provincia[keyF]}</td>
              <td>${provincia[keyM]}</td>
            </tr>`;
        }

        document.getElementById('province-name').innerText = provincia.admin1Name;
        document.getElementById('population-table').querySelector('tbody').innerHTML = tableRows;
        document.getElementById('info-table').style.display = 'block';

        new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`
                <style>
               table.popup-table {
               font-size: 8px;
               width: 70%;
                }
                </style>
                <h3>${provincia.admin1Name}</h3>
                <p>Población Total: ${poblacionTotal}</p>
                
                  `)
        .addTo(map);

         // Mostrar gráfica de pastel
            mostrarGrafica(e.features[0].properties);
      });

    });
});


let provinciasVisible = true; // Estado de visibilidad de las capas de provincias

const provinciasLayers = ['provincias-fill', 'provincias-outline']; // Identificadores de las capas de provincias

// Función que se ejecuta al hacer clic en el botón para activar/desactivar provincias
document.getElementById('toggle-provincias').addEventListener('click', function () {
  provinciasVisible = !provinciasVisible; // Cambia el estado de visibilidad

  for (const layer of provinciasLayers) {
    // Muestra u oculta las capas de provincias según su estado de visibilidad
    map.setLayoutProperty(layer, 'visibility', provinciasVisible ? 'visible' : 'none');
  }
});



// Dentro de la función que cambia la visibilidad de la capa:
map.setPaintProperty('provincias-fill', 'fill-color', [
  'interpolate',
  ['linear'],
  ['get', 'pan_admpop_adm1_2022_TL'],
  ...poblaciones.map(p => [p, getColor(p)]),
]);





function mostrarGrafica(provincia) {
  const poblacionFemenina = provincia.pan_admpop_adm1_2022_F_TL;
  const poblacionMasculina = provincia.pan_admpop_adm1_2022_M_TL;

  const ctx = document.getElementById('grafica-pastel').getContext('2d');

  // Destruir la instancia anterior de Chart (si existe)
  if (window.graficaPastel) {
    window.graficaPastel.destroy();
  }

  // Crear la nueva instancia de Chart
  window.graficaPastel = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Femenina', 'Masculina'],
      datasets: [{
        data: [poblacionFemenina, poblacionMasculina],
        backgroundColor: ['#FFC300', '#3498DB']
      }]
    },
    options: {
      title: {
        display: true,
        text: provincia.admin1Name
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var dataset = data.datasets[tooltipItem.datasetIndex];
            var value = dataset.data[tooltipItem.index];
            var total = dataset.data.reduce((acc, curr) => acc + curr);
            var percentage = Math.round((value / total) * 100);
            return `${data.labels[tooltipItem.index]}: ${percentage}%`;
          }
        }
      }
    }
  });
}
