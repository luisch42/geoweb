const map1 = 'app.js';
const map2 = 'app2.js';

let currentMap = map1;

// Función para cargar un archivo de script en la página
function loadScript(src, callback) {
  const script = document.createElement('script');
  script.src = src;
  script.onload = callback;
  document.body.appendChild(script);
}

// Función para cambiar entre los dos mapas
function toggleMap() {
  const button = document.getElementById('toggle-map');
  if (currentMap === map1) {
    currentMap = map2;
    button.innerText = 'Cambiar a mapa original';
  } else {
    currentMap = map1;
    button.innerText = 'Cambiar a mapa de calor';
  }

  // Elimina el mapa actual y carga el nuevo
  document.getElementById('map').innerHTML = '';
  loadScript(currentMap);
}

// Agrega el evento click al botón
document.getElementById('toggle-map').addEventListener('click', toggleMap);

// Carga el primer mapa al cargar la página
loadScript(map1);
