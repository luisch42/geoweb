function addparcelas() {

    //var url = 'datos/farmacias.geojson';
    var url = parcelasGeoJSON;
    map.addSource('parcelas', {
        type: 'geojson',
        data: url
    });

    map.addLayer({
        'id': 'parcelas',
        'type': 'Polygon',
        'source': 'parcelas',
        
    });


} // fin funcion


function buscarparcelas(valor) {

    var resultadosparcelas = [];

   // console.info(farmaciasGeoJSON);
    for (var i = 0; i < parcelasGeoJSON.features.length; i++) {

        var feature = parcelasGeoJSON.features[i];

        if (feature.properties.Name && 
            feature.properties.Name
            .toLowerCase()
            .includes(valor.toLowerCase())
        ) {

            feature['place_name'] = `💊 ${feature.properties.Name}`;
            feature['center'] = feature.geometry.coordinates;
            feature['place_type'] = ['place'];
            resultadosparcelas.push(feature);
        }
    }
    return resultadosparcelas;
} // fin funcion

function addFarmaciasCercanas() {

    map.addSource('farmacias_sel', {
        type: 'geojson',
        data: {
            'type': 'FeatureCollection',
            'features': []
        }
    });

    map.addLayer({
        'id': 'parcelas_sel',
        'type': 'fill',
        'source': 'parcelas_sel',
       
    });

   map.addLayer({
        "id": "parcelas_sel_text",
        "type": "vector",
        "source": "parcelas_sel",
        "layout": {
          'text-field': ['concat',['get', 'distancia'],' m'],
          "text-size": 15,
          'text-offset': [0, 1.3],
          'text-anchor': 'left'
        },
        'paint': {
            'text-color': '#f909b5',
            'text-halo-color': '#333333',
            'text-halo-width': 1
        }
      });

    map.on("click", "parcelas", function (e) {

        var puntoClick = turf.point([e.lngLat.lng, e.lngLat.lat]);
        var ff = parcelasGeoJSON;

        for (var i = 0; i < ff.features.length; i++) {

            var puntoparcelas = turf.point(ff.features[i].geometry.coordinates);
            var distancia = turf.distance(puntoClick, puntoparcelas, { units: 'meters' });
            ff.features[i].properties.distancia = parseInt(distancia);

        }

        ff.features.sort(function (a, b) {
            return a.properties.distancia - b.properties.distancia
        });

        map.getSource('parcelas_sel').setData(turf.featureCollection(ff.features.slice(1, 6)));

    })



} // fin funcion


 

