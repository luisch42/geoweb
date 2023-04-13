let map = L.map('map').setView([4.639386,-74.082412],5.3)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

document.getElementById('select-location').addEventListener('change', function(e){
    let coords = e.target.value.split(",");
    map.flyTo(coords,13);
})

// Agregar mapa base
var carto_light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {attribution: '©OpenStreetMap, ©CartoDB',subdomains: 'abcd',maxZoom: 24});

// Agregar plugin MiniMap
var minimap = new L.Control.MiniMap(carto_light,
    {
        toggleDisplay: true,
        minimized: false,
        position: "bottomleft"
    }).addTo(map);

// Agregar escala
 new L.control.scale({imperial: false}).addTo(map);

// Configurar PopUp
function popup(feature,layer){
    if(feature.properties && feature.properties.BARRIO){
        layer.bindPopup("<strong>Barrio: </strong>" + feature.properties.BARRIO + "<br/>" + "<strong>Localidad: </strong>" + feature.properties.LOCALIDAD);
    }
}

// Agregar capa en formato GeoJson
L.geoJson(barrios).addTo(map);

var barriosJS = L.geoJson(barrios,{
    onEachFeature: popup
}).addTo(map);

// Agregar coordenadas para dibujar una polilinea
var coord_camino = [
    [4.798039528031478, -74.03124090388363],
    [4.79059838513191, -74.02832266048456],
    [4.786663954996014, -74.02806516841994],
    [4.784183541760121, -74.02832266048456],
    [4.781275459625073, -74.02703520016145],
    [4.777683105825763, -74.02617689327938],
    [4.7735878498196636, -74.02655897938767],
    [4.771834421730695, -74.02735291325358],
    [4.770316205986422, -74.02692375981255]
];

var camino = L.polyline(coord_camino, {
    color: 'red'
}).addTo(map);

// Agregar un marcador
var marker_cerro = L.circleMarker(L.latLng(4.791132952755172, -73.99527784552215), {
    radius: 6,
    fillColor: "#ff0000",
    color: "blue",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.6,
}).addTo(map);

// Agregar la leyenda
const legend = L.control.Legend({
    position: "bottomright",
    collapsed: false,
    symbolWidth: 24,
    opacity:1,
    column:1,
    legends: [
        {
            label: "Cerro Guayabos",
            type: "circle",
            radius: 6,
            color: "blue",
            fillColor: "#FF0000",
            fillOpacity: 0.6,
            weight: 2,
            layers: [marker_cerro],
            inactive: false,
        }, {
            label: "Carrera Septima",
            type: "polyline",
            color: "#FF0000",
            fillColor: "#FF0000",
            weight: 2,
            layers: camino
        },  {
            label: "Barrios",
            type: "rectangle",
            color: "#0074f0",
            fillColor: "#009ff0",
            weight: 2,
            layers: barriosJS,barrios
        }, {
            label: "Marcador",
            type: "image",
            url: "Leaflet.Legend-master/examples/marker/purple.png"
        },{
            label: "Linea Punteada",
            type: "polyline",
            color: "#0000FF",
            fillColor: "#0000FF",
            dashArray: [5, 5],
            weight: 2
        }, {
            label: "Poligono",
            type: "polygon",
            sides: 5,
            color: "#FF0000",
            fillColor: "#FF0000",
            weight: 2
        }]
}).addTo(map);


// Agregar control para ver los datos al pasar el puntero

var info = L.control();

// Crear un div con una clase info
info.onAdd = function(map){
    this._div = L.DomUtil.create('div','info');
    this.update();
    return this._div;
};

// Agregar el metodo que actualiza el control segun el puntero vaya pasando
info.update = function(props){
    this._div.innerHTML = '<h4>Total Viviendas por Barrio</h4>' + 
                            (props ? '<b>' + props.BARRIO + '</b><br/>' + props.TOT_VIVIEN + ' viviendas</sup>'
                            : 'Pase el puntero por un barrio');
};

info.addTo(map);

// Generar rangos de colores de acuerdo con el atributo o campo TOT_VIVIEN
function getColor(d){
    return  d > 9000 ? '#2510a3' :
            d > 7500 ? '#0000ff' :
            d > 6000 ? '#673dff' :
            d > 4500 ? '#9265ff' :
            d > 2500 ? '#b38bff' :
            d > 1000 ? '#cfb1ff' :
            d > 0    ? '#e8d8ff' :
                       '#ffffff';
}

// Crear la funcion para mostrar la simbologia de acuerdo al campo TOT_VIVIEN

function style(feature){
    return {
        fillColor: getColor(feature.properties.TOT_VIVIEN),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

// AGregar interaccion del puntero con la capa para resaltar el objeto
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    info.update(layer.feature.properties);
}

// Configurar los cambios de resaltado y zoom de la capa

var barriosJS;

function resetHighlight(e){
    barriosJS.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e){
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer){
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

// Agregar capa en formato GeoJson
barriosJS = L.geoJson(barrios,{
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);
